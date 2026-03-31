import { Container } from "typescript-ioc";
import { TasksRepository } from "../domain/contracts/tasks-repository";
import { EmailService } from "../domain/contracts/email/email-service";
import { CronJobException } from "../domain/errors/errors";
import { logger } from "../infrastructure/config/logger";

export async function checkUpcomingTasks() {
  try {
    logger.info('cron job started - checking upcoming tasks');

    const tasksRepository = Container.get(TasksRepository);
    const emailService = Container.get(EmailService);

    const now = new Date();
    const oneWeekAhead = new Date(now);
    oneWeekAhead.setDate(now.getDate() + 7);

    const emailsTasks = await tasksRepository.findTasksDueBetween(now, oneWeekAhead);
    logger.info({ count: emailsTasks.length }, 'tasks due in the next 7 days found');

    if (emailsTasks.length === 0) {
      logger.info('no upcoming tasks found, cron job finished');
      return;
    }

    for (const task of emailsTasks) {
      const dueDate = new Date(task.due_date);
      const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let subject = "";
      if (diffInDays === 7) subject = "Sua tarefa vence em 7 dias!";
      else if (diffInDays === 3) subject = "Sua tarefa vence em 3 dias!";

      if (!subject) {
        logger.warn({ taskTitle: task.title, diffInDays }, 'task found but does not match reminder window, skipping');
        continue;
      }

      try {
        logger.info({ taskTitle: task.title, userEmail: task.email, diffInDays }, 'sending reminder email');

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

        logger.info({ taskTitle: task.title, userEmail: task.email }, 'reminder email sent successfully');

      } catch (error) {
        logger.error({ taskTitle: task.title, userEmail: task.email, error: (error as Error).message }, 'failed to send reminder email');
      }
    }

    logger.info({ processed: emailsTasks.length }, 'cron job finished');

  } catch (error) {
    logger.error({ error: (error as Error).message }, 'cron job failed');
    throw new CronJobException('Erro ao executar cron job de verificação de tarefas');
  }
}