import { Container } from "typescript-ioc";
import { TasksRepository } from "../domain/contracts/tasks-repository";
import { EmailService } from "../domain/contracts/email/email-service";

async function checkUpcomingTasks() {
    const tasksRepository = Container.get(TasksRepository);
    const emailService = Container.get(EmailService);

    const now = new Date();
    const oneWeekAhead = new Date(now);
    oneWeekAhead.setDate(now.getDate() + 7);

    const threeDaysAhead = new Date(now);
    threeDaysAhead.setDate(now.getDate() + 3);

    const tasks = await tasksRepository.getTasks();

    for (const task of tasks) {
        const dueDate = new Date(task.dueDate);
        const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let subject = "";
        if (diffInDays === 7) subject = "Sua tarefa vence em 7 dias!";
        else if (diffInDays === 3) subject = "Sua tarefa vence em 3 dias!";
        else continue;

        await emailService.sendEmail(
            'email',
            subject,
            `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>${subject}</h2>
          <p><strong>Título:</strong> ${task.title}</p>
          <p><strong>Descrição:</strong> ${task.description}</p>
          <p><strong>Data de vencimento:</strong> ${dueDate.toLocaleDateString()}</p>
        </div>
      `
        );
    }
}

checkUpcomingTasks();