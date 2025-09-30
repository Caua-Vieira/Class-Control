import { Task } from "../entities/tasks";
import { TasksResponseDTO } from "../types/tasks-response-dto";

export function mapTaskToDTO(task: Task[]): TasksResponseDTO[] {
    return task.map(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        dueDate: i.dueDate,
        status: i.status,
        createdAt: i.createdAt,
        user: i.user.name
    }))
}
