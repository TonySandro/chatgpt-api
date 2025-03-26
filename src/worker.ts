import axios from "axios";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { IChatJob } from "./models/chat-job";

dotenv.config();

const QUEUE_API_URL = process.env.QUEUE_API_URL!;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function processJob(job: IChatJob) {
  console.log("Job recebido:", job.prompt);
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: job.prompt }],
    });

    const resposta = completion.choices[0].message.content;
    console.log("Resposta do ChatGPT:", resposta);
  } catch (err) {
    console.error("Erro ao chamar OpenAI:", err);
  }
}

async function pollJobs() {
  while (true) {
    try {
      const response = await axios.get(
        `${QUEUE_API_URL}/queues/chatgpt-jobs/next`
      );
      const job: IChatJob | null = response.data;

      if (job && job.id) {
        await processJob(job);
        await axios.post(`${QUEUE_API_URL}/queues/chatgpt-jobs/${job.id}/ack`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Erro ao buscar job:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

console.log("Worker pronto. Aguardando...");

pollJobs();
