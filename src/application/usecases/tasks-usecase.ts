import { Inject } from "typescript-ioc";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../domain/types/tasks-request-dto";
import { TasksResponseDTO } from "../../domain/types/tasks-response-dto";
import { InvalidDueDateException, NotFoundException } from "../../domain/errors/errors";
import { Task } from "../../domain/entities/tasks";
import { TaskCreatedEvent } from "../../domain/events/task-created-events";
import { MessageQueue } from "../../domain/contracts/messaging/message-queue";

export class TasksUseCase {

    constructor(
        @Inject private readonly tasksRepository: TasksRepository,
        @Inject private readonly messageQueue: MessageQueue
    ) { }

    async createTasks(input: TasksRequestDTO): Promise<void> {
        const now = new Date();
        const dueDate = new Date(input.dueDate);

        if (dueDate < now) {
            throw new InvalidDueDateException('A data de vencimento não pode ser anterior à data atual');
        }

        const task = await this.tasksRepository.createTasks(input);

        const event: TaskCreatedEvent = {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toString(),
            userEmail: input.userEmail,
            userId: task.user.id,
        };

        await this.messageQueue.publish("task_created", event);
    }

    async deleteTasks(id: number): Promise<void> {
        await this.tasksRepository.deleteTasks(id);
    }

    async getTasks(): Promise<TasksResponseDTO[]> {
        const response = await this.tasksRepository.getTasks();

        if (!response) throw new NotFoundException("Tarefas não encontradas");

        return response;
    }

    async concludeTasks(id: number): Promise<void> {
        await this.tasksRepository.concludeTasks(id, { status: 'Concluída' });
    }

    async updateTasks(id: number, data: Partial<Task>): Promise<void> {
        await this.tasksRepository.concludeTasks(id, data);
    }
}