import amqp, { Channel, Connection } from "amqplib";
import { MessageQueue } from "../../domain/contracts/messaging/message-queue";
import { MessageQueueException } from "../../domain/errors/errors";

export class RabbitMQService implements MessageQueue {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    private async getChannel(): Promise<Channel> {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect("amqp://localhost");
            }

            if (!this.channel) {
                this.channel = await this.connection.createChannel();
            }

            return this.channel;
        } catch (error) {
            throw new MessageQueueException('Falha ao conectar ao RabbitMQ');
        }
    }

    async publish(queue: string, message: any): Promise<void> {
        try {
            const channel = await this.getChannel();
            await channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
        } catch (error) {
            throw new MessageQueueException('Falha ao publicar mensagem na fila');
        }
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            this.channel = null;
            this.connection = null;
        } catch (error) {
            throw new MessageQueueException('Erro ao fechar conexão com RabbitMQ');
        }
    }
}