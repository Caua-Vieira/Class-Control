import { Inject } from "typescript-ioc";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../domain/types/tasks-request-dto";

export class TasksUseCase {

    constructor(
        @Inject private readonly tasksRepository: TasksRepository
    ) { }

    async createTasksUseCase(input: TasksRequestDTO): Promise<void> {
        await this.tasksRepository.createTasks(input);
    }
}