import amqplib, { ChannelModel } from "amqplib";

let connection: ChannelModel | undefined;

export class EventChannel {
  constructor(private channelName: string) {}

  async createChannel() {
    if (!connection) {
      connection = await amqplib.connect(process.env.MB_URL!);
    }

    const channel = await connection!.createChannel();
    await channel.assertExchange(this.channelName, "direct", {
      durable: false,
    });

    return channel;
  }

  async emit(key: string, data: Record<string, unknown>) {
    const channel = await this.createChannel();

    await channel.publish(
      this.channelName,
      key,
      Buffer.from(
        JSON.stringify({
          ...data,
          date: new Date(),
        }),
      ),
    );
  }

  async consume(
    key: string,
    listener: (data: unknown) => Promise<void> | void,
  ) {
    const channel = await this.createChannel();

    const queue = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue.queue, this.channelName, key);

    const consumer = await channel.consume(queue.queue, async (data) => {
      await listener(JSON.parse(data!.content.toString()));
      channel.ack(data!);
    });

    return () => {
      channel.cancel(consumer.consumerTag);
    };
  }
}
