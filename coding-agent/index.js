import { tool } from "@langchain/core/tools";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { tellJokeTool } from "./tools";
import { ToolMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0
})

model.bindTools([tellJokeTool]);

async function AgentNode(state) {
  const message = await model.invoke(
    state.messages
  )
  return { messages: [message] }
}

function ToolCallNode(state) {
  const mostRecentMessage = state.messages[state.messages.length - 1];

  const messages = mostRecentMessage?.tool_calls.map(async (toolCall) => {
    if (toolCall.name === "tellJokeTool") {
      const response = await tellJokeTool.invoke();
      return new ToolMessage(response)
    }
    return new ToolMessage("An error occurred in the tool.");
  });

  return { messages };

}

function ShouldCallTools(state) {
  const mostRecentMessage = state.messages[state.messages.length - 1];
  if (mostRecentMessage?.tool_calls?.length) return "tools"
  return END;
}


const agent = new StateGraph(MessagesAnnotation)
  .addNode("agent", AgentNode)
  .addNode("tools", ToolCallNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", ShouldCallTools)
  .addEdge("tools", "agent")
