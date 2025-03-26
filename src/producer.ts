import axios from "axios";
import dotenv from "dotenv";
import { IChatJob } from "./models/chat-job";

dotenv.config();

const QUEUE_API_URL = process.env.QUEUE_API_URL!;

async function sendJob(prompt: string): Promise<void> {
  const job: IChatJob = { prompt };

  try {
    const response = await axios.post(
      `${QUEUE_API_URL}/queues/chatgpt-jobs`,
      job
    );

    console.log("Job enviado:", response.data);
  } catch (error) {
    console.error("Erro ao enviar job:", error);

    throw error;
  }
}
