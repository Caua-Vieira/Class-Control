import amqp from "amqplib";
import { EmailService } from "../domain/contracts/email/email-service";
import { Container } from "typescript-ioc";
import { QueueProcessingException } from "../domain/errors/errors";

async function startWorker() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const queue = "task_created";
        await channel.assertQueue(queue, { durable: true });

        const emailService = Container.get(EmailService);

        channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());

                try {
                    const content = JSON.parse(msg.content.toString());
                    const { title, description, userEmail } = content;

                    await emailService.sendEmail(
                        userEmail,
                        "Nova tarefa criada",
                        `<h3>${title}</h3><p>${description}</p>`
                    );

                    channel.ack(msg);
                } catch (error) {
                    throw new QueueProcessingException('Erro ao processar fila');
                }
            }
        });
    } catch (error) {
        process.exit(1);
    }
}

startWorker();
