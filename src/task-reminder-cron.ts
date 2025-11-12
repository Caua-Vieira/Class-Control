import cron from "node-cron";
import { checkUpcomingTasks } from "./workers/task-reminder-worker";
import './infrastructure/config/ioc';

cron.schedule("*/10 * * * * *", async () => {
    console.log("⏰ Executando verificação de tarefas...");
    await checkUpcomingTasks();
});

console.log("✅ Cronjob iniciado.");
