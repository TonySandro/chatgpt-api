// src/services/DeepSeekChatProcessor.ts
import axios from "axios";
import dotenv from "dotenv";
import { IChatProcessor } from "../interfaces/chat-processor";
import { ChatJob } from "../models/chat-job";

dotenv.config();

export class DeepSeekChatProcessor implements IChatProcessor {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL =
      process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1";
    this.apiKey = process.env.DEEPSEEK_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Chave da API do DeepSeek não foi definida.");
    }
  }

  async process(job: ChatJob): Promise<void> {
    console.log("Processando job com DeepSeek:", job.prompt);
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          prompt: job.prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const completion = response.data.completion;
      console.log("Resposta do DeepSeek:", completion);
    } catch (error) {
      console.error("Erro ao processar job com DeepSeek:", error);
      throw error;
    }
  }
}
