import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { StateSchema, StateGraph, END, START } from "@langchain/langgraph";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import fs from "fs";
import * as z from "zod";

const SYSTEM_PROMPT =
  `You are a helpful AI psuedo code compiler. You will be given some psuedo code and the language to tranlate it to.
Translate the psuedo code to the language.
Repond only with the tranlated code, and nothing else.`

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0
})

const CompilerGraphSchema = new StateSchema({
  inputPath: z.string(),
  outputPath: z.string(),
  language: z.string(),
  inputFileContents: z.string(),
  outputFileContents: z.string(),
});


// define the nodes

function ReadFileNode(state) {
  const inputFileContents = fs.readFileSync(state.inputPath).toString();
  console.log("READ FILE:", inputFileContents)
  return {
    inputFileContents
  }
}

async function AITranslationNode(state) {
  if (process.env.DRY_RUN === 'true') {
    return {
      outputFileContents: 'def myFunc():\n    pass'
    }
  }

  const res = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(
      `Language: ${state.language}\nInput code: ${state.inputFileContents}`
    )
  ])
  // do the ai thing!
  return {
    outputFileContents: res.content
  }
}

function WriteFileNode(state) {
  fs.writeFileSync(state.outputPath, state.outputFileContents);
  return {};
}



const workflow = new StateGraph(CompilerGraphSchema)
  .addNode('read', ReadFileNode)
  .addNode('ai', AITranslationNode)
  .addNode('write', WriteFileNode)
  .addEdge(START, 'read')
  .addEdge('read', 'ai')
  .addEdge('ai', 'write')
  .addEdge('write', END)
  .compile();


// node index.js myfile.myext output.py python
const [_, __, inputPath, outputPath, language] = process.argv;
console.log(process.argv);

await workflow.invoke({
  inputPath,
  outputPath,
  language,
});








