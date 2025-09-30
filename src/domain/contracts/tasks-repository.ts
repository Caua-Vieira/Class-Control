import { TasksRequestDTO } from "../types/tasks-request-dto";
import { TasksResponseDTO } from "../types/tasks-response-dto";

export abstract class TasksRepository {
    abstract createTasks(input: TasksRequestDTO): Promise<void>;
    abstract deleteTasks(id: number): Promise<void>;
    abstract getTasks(): Promise<TasksResponseDTO[]>;
}