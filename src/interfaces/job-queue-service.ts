import { ChatJob } from "../models/chat-job";

export interface IJobQueueService {
  sendJob(job: ChatJob): Promise<any>;
  getNextJob(): Promise<ChatJob | null>;
  acknowledgeJob(jobId: string): Promise<any>;
}
