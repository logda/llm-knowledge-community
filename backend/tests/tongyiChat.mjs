import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

// Default model is qwen-turbo
const qwenTurbo = new ChatAlibabaTongyi({
  alibabaApiKey: "alibabaApiKey",
});


const messages = [new HumanMessage("Hello")];

const res = await qwenTurbo.invoke(messages);
/*
AIMessage {
  content: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
}
*/

console.log(res);
