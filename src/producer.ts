import { ChatJob } from "./models/chat-job";
import { JobQueueService } from "./services/job-queue-service";

const jobQueueService = new JobQueueService();

export async function sendJob(prompt: string): Promise<void> {
  const job: ChatJob = { prompt };
  await jobQueueService.sendJob(job);
}
