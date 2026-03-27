import amqp from "amqplib";
import { EmailService } from "../domain/contracts/email/email-service";
import { Container } from "typescript-ioc";
import { QueueProcessingException } from "../domain/errors/errors";
import "../infrastructure/config/ioc";
import { taskCreatedTemplate } from "../infrastructure/email/template/task-created-template";
import { logger } from "../infrastructure/config/logger";

async function startWorker() {
    try {
        logger.info('task created worker starting');

        const connection = await amqp.connect("amqp://localhost");
        logger.info('rabbitmq connection established');

        const channel = await connection.createChannel();
        const queue = "task_created";
        await channel.assertQueue(queue, { durable: true });

        logger.info({ queue }, 'listening for messages');

        const emailService = Container.get(EmailService);

        channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                const { id, title, description, dueDate, userEmail, userId } = content;

                logger.info({ taskId: id, userId, userEmail }, 'message received');

                try {
                    const emailBody = taskCreatedTemplate(title, description, dueDate);

                    await emailService.sendEmail(
                        userEmail,
                        "Nova tarefa criada — SmartTasks",
                        emailBody
                    );

                    channel.ack(msg);
                    logger.info({ taskId: id, userEmail }, 'email sent and message acked');

                } catch (error) {
                    logger.error({ taskId: id, userEmail, error: (error as Error).message }, 'failed to process message');
                    throw new QueueProcessingException('Erro ao processar fila');
                }
            }
        });

    } catch (error) {
        logger.error({ error: (error as Error).message }, 'worker failed to start');
        process.exit(1);
    }
}

startWorker();