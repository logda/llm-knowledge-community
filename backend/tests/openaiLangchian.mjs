import { OpenAI } from "@langchain/openai";

console.log(process.env.OPENAI_API_KEY);
const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.OPENAI_API_KEY,
  proxy: "http://localhost:7890"
  // other params...
});

const inputText = "OpenAI is an AI company that ";

const completion = await llm.invoke(inputText);
completion;