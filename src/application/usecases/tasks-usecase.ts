import { Inject } from "typescript-ioc";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../domain/types/tasks-request-dto";
import { TasksResponseDTO } from "../../domain/types/tasks-response-dto";
import { NotFoundException } from "../../domain/errors/errors";
import { Task } from "../../domain/entities/tasks";

export class TasksUseCase {

    constructor(
        @Inject private readonly tasksRepository: TasksRepository
    ) { }

    async createTasks(input: TasksRequestDTO): Promise<void> {
        await this.tasksRepository.createTasks(input);
    }

    async deleteTasks(id: number): Promise<void> {
        await this.tasksRepository.deleteTasks(id);
    }

    async getTasks(): Promise<TasksResponseDTO[]> {
        const response = await this.tasksRepository.getTasks();

        if (!response) throw new NotFoundException("Tarefas não encontradas");

        return response
    }

    async concludeTasks(id: number): Promise<void> {
        await this.tasksRepository.concludeTasks(id, { status: 'Concluída' });
    }

    async updateTasks(id: number, data: Partial<Task>): Promise<void> {
        await this.tasksRepository.concludeTasks(id, data);
    }
}