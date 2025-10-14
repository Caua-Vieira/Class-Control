import amqp, { Channel, Connection } from "amqplib";
import { MessageQueue } from "../../domain/contracts/messaging/message-queue";

export class RabbitMQService implements MessageQueue {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    private async getChannel(): Promise<Channel> {
        if (!this.connection) {
            this.connection = await amqp.connect("amqp://localhost");
        }

        if (!this.channel) {
            this.channel = await this.connection.createChannel();
        }

        return this.channel;
    }

    async publish(queue: string, message: any): Promise<void> {
        const channel = await this.getChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }

    async close(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        this.channel = null;
        this.connection = null;
    }
}