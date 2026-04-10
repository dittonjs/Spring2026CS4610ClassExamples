import { StateGraph, MessagesAnnotation, interrupt, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { readFileTool, writeFileTool, listDirectoryTool, executeCommandTool } from "./tools.js";
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

let model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0,
});

const tools = [readFileTool, writeFileTool, listDirectoryTool, executeCommandTool];
model = model.bindTools(tools);

async function AgentNode(state) {
  const message = await model.invoke(state.messages);
  return { messages: [message] };
}

async function ToolCallNode(state) {
  const mostRecentMessage = state.messages[state.messages.length - 1];
  const toolMap = Object.fromEntries(tools.map((t) => [t.name, t]));

  const messages = [];

  for (const toolCall of mostRecentMessage?.tool_calls ?? []) {
    const matchedTool = toolMap[toolCall.name];

    if (!matchedTool) {
      messages.push(new ToolMessage("Unknown tool: " + toolCall.name, toolCall.id));
      continue;
    }

    // Human-in-the-loop approval using LangGraph interrupt.
    if (toolCall.name === "executeCommand") {
      const approval = interrupt({
        type: "approval_request",
        toolName: toolCall.name,
        toolCallId: toolCall.id,
        args: toolCall.args,
        message: `Approve execution of command: ${toolCall.args.command} ${(toolCall.args.args ?? []).join(" ")
          }?`,
      });

      if (!approval?.approved) {
        messages.push(new ToolMessage("Command execution denied by user.", toolCall.id));
        continue;
      }
    }

    const response = await matchedTool.invoke(toolCall.args);
    messages.push(new ToolMessage(response, toolCall.id));
  }

  return { messages };
}

function ShouldCallTools(state) {
  const mostRecentMessage = state.messages.at(-1);
  if (mostRecentMessage?.tool_calls?.length) return "tools";
  return END;
}

const agent = new StateGraph(MessagesAnnotation)
  .addNode("agent", AgentNode)
  .addNode("tools", ToolCallNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", ShouldCallTools)
  .addEdge("tools", "agent")
  .compile();

async function main() {
  const rl = readline.createInterface({ input, output });
  const messages = [
    new SystemMessage(
      "You are a coding agent. You have tools to read and write files, list directories, and execute commands. Always write clean code and comment where appropriate. Ask before using executeCommand when possible."
    ),
  ];

  while (true) {
    const prompt = await rl.question("prompt >: ");
    if (prompt === "exit") break;

    messages.push(new HumanMessage(prompt));
    const response = await agent.invoke({ messages });
    console.log(response.messages.at(-1).content);
    messages.push(response.messages.at(-1));
  }

  rl.close();
}

await main();
