import { OpenAI } from "openai";
import dotenv from "dotenv";
import { IChatProcessor } from "../interfaces/chat-processor";
import { ChatJob } from "../models/chat-job";

dotenv.config();

export class OpenAIChatProcessor implements IChatProcessor {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }

  async process(job: ChatJob): Promise<void> {
    console.log("Processando job:", job.prompt);
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: job.prompt }],
      });

      const resposta = completion.choices[0].message.content;
      console.log("Resposta do ChatGPT:", resposta);
    } catch (error) {
      console.error("Erro ao processar job com OpenAI:", error);
      throw error;
    }
  }
}
