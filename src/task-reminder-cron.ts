import cron from "node-cron";
import { checkUpcomingTasks } from "./workers/task-reminder-worker";
import './infrastructure/config/ioc';
import { Container } from "typescript-ioc";
import { Database } from "./infrastructure/database/database";

async function startCron() {
    const database = Container.get(Database);
    await database.connect();

    console.log("✅ Cronjob iniciado.");

    cron.schedule("*/10 * * * * *", async () => {
        try {
            console.log("Executando verificação de tarefas...");
            await checkUpcomingTasks();
        } catch (error) {
            console.error("[NODE-CRON] ERROR", error);
        }
    });
}

startCron();
