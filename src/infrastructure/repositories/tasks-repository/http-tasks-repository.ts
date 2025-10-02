import { Inject } from "typescript-ioc";
import { Database } from "../../database/database";
import { DatabaseException } from "../../../domain/errors/errors";
import { TasksRepository } from "../../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../../domain/types/tasks-request-dto";
import { Task } from "../../../domain/entities/tasks";
import { TasksResponseDTO } from "../../../domain/types/tasks-response-dto";
import { mapTaskToDTO } from "../../../domain/mappers/map-tasks-response";

export class HttpTasksRepository implements TasksRepository {
    constructor(@Inject private database: Database) { }

    async createTasks(input: TasksRequestDTO): Promise<void> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            const task = repository.create({
                title: input.title,
                description: input.description,
                dueDate: input.dueDate,
                status: input.status,
                user: { id: input.userId },
            });

            await repository.save(task);

        } catch (error) {
            throw new DatabaseException("Ocorreu um erro ao criar tasks");
        }
    }

    async deleteTasks(id: number): Promise<void> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            await repository.delete(id);

        } catch (error) {
            throw new DatabaseException("Ocorreu um erro ao deletar a task");
        }
    }

    async getTasks(): Promise<TasksResponseDTO[]> {
        try {

            const repository = this.database.appDataSource.getRepository(Task);

            const tasks = await repository
                .createQueryBuilder("t")
                .innerJoinAndSelect("t.user", "u")
                .select([
                    "t.id",
                    "t.title",
                    "t.description",
                    "t.dueDate",
                    "t.status",
                    "t.createdAt",
                    "u.name"
                ])
                .where("t.status = :status", { status: "Pendente" })
                .getMany();

            return mapTaskToDTO(tasks);

        } catch (error) {
            throw new DatabaseException("Ocorreu um erro ao buscar as tasks");
        }
    }

    async concludeTasks(id: number, data: Partial<Task>): Promise<void> {
        try {
            await this.database.appDataSource.getRepository(Task).update(id, data);
        } catch (error) {
            throw new DatabaseException("Erro ao atualizar a task");
        }
    }
}