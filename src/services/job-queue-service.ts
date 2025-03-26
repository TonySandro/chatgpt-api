import axios from "axios";
import dotenv from "dotenv";
import { IJobQueueService } from "../interfaces/job-queue-service";
import { ChatJob } from "../models/chat-job";

dotenv.config();

const RABBITMQ_API_URL = process.env.RABBITMQ_API_URL!;

export class JobQueueService implements IJobQueueService {
  async sendJob(job: ChatJob): Promise<any> {
    try {
      const response = await axios.post(
        `${RABBITMQ_API_URL}/queues/chatgpt-jobs`,
        job
      );
      console.log("Job enviado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar job:", error);
      throw error;
    }
  }

  async getNextJob(): Promise<ChatJob | null> {
    try {
      const response = await axios.get(
        `${RABBITMQ_API_URL}/queues/chatgpt-jobs/next`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar job:", error);
      throw error;
    }
  }

  async acknowledgeJob(jobId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${RABBITMQ_API_URL}/queues/chatgpt-jobs/${jobId}/ack`
      );
      console.log("Job confirmado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao confirmar job:", error);
      throw error;
    }
  }
}
