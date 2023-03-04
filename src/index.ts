import readline from 'readline';
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import ChatGPTClient, { ChatResponse } from "./client/chatGPTClient";

const client = new ChatGPTClient();

interface ChatGptMessage {
  role: ChatCompletionRequestMessageRoleEnum,
  content: string,
}

const chatGptMessages = (
  message: string
): ChatGptMessage[] => [
  {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: 'You are a helpful assistant.',
  },
  {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: message,
  }
]

const sendChatRequest = async (
  message: string
): Promise<ChatResponse> => {
  const result = await client.respond(chatGptMessages(message))
  return result;
}

const question = (): Promise<ChatResponse> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question('openai>', async (question: string) => {
      const result = await sendChatRequest(question)
      resolve(result);
      rl.close();
    });
  })
};

const main = async (): Promise<void> => {
  while (true) {
    const answer = await question()
    console.log(answer.text);
  }
}

main();
