import amqp from "amqplib";
import { EmailService } from "../domain/contracts/email/email-service";
import { Container } from "typescript-ioc";

async function startWorker() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const queue = "task_created";
        await channel.assertQueue(queue, { durable: true });

        const emailService = Container.get(EmailService);

        console.log(`Aguardando mensagens na fila: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());

                console.log("Mensagem recebida:", content);

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
                    console.log("Erro ao processar mensagem:", error);
                }
            }
        });
    } catch (error) {
        console.error("[Worker] Erro ao iniciar o consumidor:", error);
        process.exit(1);
    }
}

startWorker();
