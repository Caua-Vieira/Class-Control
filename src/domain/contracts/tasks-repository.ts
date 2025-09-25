import { TasksRequestDTO } from "../types/tasks-request-dto";

export abstract class TasksRepository {
    abstract createTasks(input: TasksRequestDTO): Promise<void>;
}