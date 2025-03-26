import { ChatJob } from "./models/chat-job";
import { OpenAIChatProcessor } from "./services/openai-chat-processor";
import { RabbitMqConnection } from "./services/rabbit-connection";

async function startWorker() {
  const rabbitConn = RabbitMqConnection.getInstance();
  await rabbitConn.connect();

  const channel = rabbitConn.getChannel();
  const queue = "chatgpt-jobs";
  const chatProcessor = new OpenAIChatProcessor();

  await channel.assertQueue(queue, { durable: true });
  console.log("Worker pronto. Aguardando mensagens na fila:", queue);

  channel.consume(
    queue,
    async (msg) => {
      if (msg) {
        try {
          const job: ChatJob = JSON.parse(msg.content.toString());
          console.log("Mensagem recebida:", job.prompt);
          await chatProcessor.process(job);
          channel.ack(msg);
        } catch (error) {
          console.error("Erro ao processar mensagem:", error);
        }
      }
    },
    { noAck: false }
  );
}

startWorker();
