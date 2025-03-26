import { ChatJob } from "./models/chat-job";
import { RabbitMqConnection } from "./services/rabbit-connection";

export async function sendJob(prompt: string): Promise<void> {
  const job: ChatJob = { prompt };
  const rabbitConn = RabbitMqConnection.getInstance();
  const channel = rabbitConn.getChannel();
  const queue = "chatgpt-jobs";

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });
  console.log("Job enviado para a fila:", job);
}
