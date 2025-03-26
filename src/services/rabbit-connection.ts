import client, { Connection, Channel } from "amqplib";

export class RabbitMqConnection {
  private static instance: RabbitMqConnection;
  private connection?: Connection;
  public channel?: Channel;

  public constructor() {
    this.connect();
  }

  public static getInstance(): RabbitMqConnection {
    if (!RabbitMqConnection.instance) {
      RabbitMqConnection.instance = new RabbitMqConnection();
    }
    return RabbitMqConnection.instance;
  }

  public async connect(): Promise<void> {
    const url =
      process.env.RABBITMQ_URL?.toString() || "amqp://teste:123@localhost:5672";
    if (this.connection) {
      console.warn("Already connected to RabbitMQ");
      return;
    }

    try {
      this.connection = (await client.connect(url)).connection;
      var channnelModel = await client.connect(url);
      this.channel = await channnelModel.createChannel();
      console.log("Connected to RabbitMQ successfully");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      process.exit(1);
    }
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not initialized. Call connect() first."
      );
    }
    return this.channel;
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = undefined;
      }
      if (this.connection) {
        this.connection = undefined;
      }
      console.log("RabbitMQ connection closed");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}

RabbitMqConnection.getInstance();
