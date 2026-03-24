import { Inject } from "typescript-ioc";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../domain/types/tasks-request-dto";
import { TasksResponseDTO } from "../../domain/types/tasks-response-dto";
import { InvalidDueDateException, NotFoundException } from "../../domain/errors/errors";
import { Task } from "../../domain/entities/tasks";
import { TaskCreatedEvent } from "../../domain/events/task-created-events";
import { MessageQueue } from "../../domain/contracts/messaging/message-queue";
import { logger } from "../../infrastructure/config/logger";

export class TasksUseCase {

    constructor(
        @Inject private readonly tasksRepository: TasksRepository,
        @Inject private readonly messageQueue: MessageQueue
    ) { }

    async createTasks(input: TasksRequestDTO): Promise<void> {
        logger.info({ userId: input.userId, dueDate: input.dueDate }, 'creating task');

        const now = new Date();
        const dueDate = new Date(input.dueDate);

        if (dueDate < now) {
            logger.warn({ userId: input.userId, dueDate: input.dueDate }, 'task creation failed: invalid due date');
            throw new InvalidDueDateException('A data de vencimento não pode ser anterior à data atual');
        }

        const task = await this.tasksRepository.createTasks(input);
        logger.info({ taskId: task.id, userId: task.user.id }, 'task created');

        const event: TaskCreatedEvent = {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toString(),
            userEmail: input.userEmail,
            userId: task.user.id,
        };

        await this.messageQueue.publish("task_created", event);
        logger.info({ taskId: task.id, userId: task.user.id }, 'task created event published');
    }

    async deleteTasks(id: number): Promise<void> {
        logger.info({ taskId: id }, 'deleting task');
        await this.tasksRepository.deleteTasks(id);
        logger.info({ taskId: id }, 'task deleted');
    }

    async getTasks(): Promise<TasksResponseDTO[]> {
        logger.info('fetching tasks');
        const response = await this.tasksRepository.getTasks();

        if (!response) {
            logger.warn('no tasks found');
            throw new NotFoundException("Tarefas não encontradas");
        }

        logger.info({ count: response.length }, 'tasks fetched');
        return response;
    }

    async concludeTasks(id: number): Promise<void> {
        logger.info({ taskId: id }, 'concluding task');
        await this.tasksRepository.concludeTasks(id, { status: 'Concluída' });
        logger.info({ taskId: id }, 'task concluded');
    }

    async updateTasks(id: number, data: Partial<Task>): Promise<void> {
        logger.info({ taskId: id }, 'updating task');
        await this.tasksRepository.updateTasks(id, data);
        logger.info({ taskId: id }, 'task updated');
    }
}