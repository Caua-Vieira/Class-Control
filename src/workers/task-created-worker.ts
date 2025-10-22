import amqp from "amqplib";

async function startWorker() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const queue = "task_created";
        await channel.assertQueue(queue, { durable: true });

        console.log(`Aguardando mensagens na fila: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());

                console.log("Mensagem recebida:", content);

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("[Worker] Erro ao iniciar o consumidor:", error);
        process.exit(1);
    }
}

startWorker();
