import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
} from 'openai';
import * as dotenv from 'dotenv'
dotenv.config();

export interface ChatResponse {
  text?: string;
  messageId?: string;
}

export default class ChatGPTClient {
  private openAI: OpenAIApi;

  constructor() {
      const config = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
      });
      this.openAI = new OpenAIApi(config);
  }

  async respond(
    messages: Array<ChatCompletionRequestMessage>
  ): Promise<ChatResponse> {
    try {
      if (!messages.length) return { text: 'No messages' }
      const request: CreateChatCompletionRequest = {
          messages,
          model: 'gpt-3.5-turbo',
      }
      const res = await this.openAI.createChatCompletion(request);
      if (!res.data || !res.data.choices) {
          return { text: 'Please try again later.' }
      }
      return {
          text: res.data.choices[0].message?.content,
          messageId: res.data.id,
      }
    } catch(e) {
      console.error(e);
      throw e;
    }
  }
}