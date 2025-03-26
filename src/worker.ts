import { ChatJob } from "./models/chat-job";
import { JobQueueService } from "./services/job-queue-service";
import { OpenAIChatProcessor } from "./services/openai-chat-processor";

const jobQueueService = new JobQueueService();
const chatProcessor = new OpenAIChatProcessor();

async function pollJobs(): Promise<void> {
  while (true) {
    try {
      const job: ChatJob | null = await jobQueueService.getNextJob();

      if (job && job.id) {
        await chatProcessor.process(job);
        await jobQueueService.acknowledgeJob(job.id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Erro no ciclo de processamento de jobs:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

console.log("Worker iniciado. Aguardando jobs...");
pollJobs();
