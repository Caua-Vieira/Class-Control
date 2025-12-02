import { Container } from "typescript-ioc";
import { TasksRepository } from "../domain/contracts/tasks-repository";
import { EmailService } from "../domain/contracts/email/email-service";
import { CronJobException } from "../domain/errors/errors";

export async function checkUpcomingTasks() {
  try {
    const tasksRepository = Container.get(TasksRepository);
    const emailService = Container.get(EmailService);

    const now = new Date();
    const oneWeekAhead = new Date(now);
    oneWeekAhead.setDate(now.getDate() + 7);

    const threeDaysAhead = new Date(now);
    threeDaysAhead.setDate(now.getDate() + 3);

    const emailsTasks = await tasksRepository.findTasksDueBetween(now, oneWeekAhead);

    for (const task of emailsTasks) {
      const dueDate = new Date(task.due_date);
      const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let subject = "";
      if (diffInDays === 7) subject = "Sua tarefa vence em 7 dias!";
      else if (diffInDays === 3) subject = "Sua tarefa vence em 3 dias!";

      await emailService.sendEmail(
        task.email,
        subject,
        `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #2a7ae4;">${subject}</h2>
            <p>Olá! 👋</p>
            <p>Essa é apenas uma lembrança de que a seguinte tarefa está se aproximando do prazo de vencimento:</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #2a7ae4; padding: 12px; margin: 16px 0; border-radius: 6px;">
              <p><strong>Título:</strong> ${task.title}</p>
              <p><strong>Descrição:</strong> ${task.description}</p>
              <p><strong>Data de vencimento:</strong> <span style="color: #d9534f;">${dueDate.toLocaleDateString()}</span></p>
            </div>

            <p>Não se esqueça de concluir sua tarefa antes da data! 😉</p>
            <p>— Equipe <strong>SmartTasks</strong></p>
          </div>
        `
      );
    }
  } catch (error) {
    throw new CronJobException('Erro ao executar cron job de verificação de tarefas');
  }
}
