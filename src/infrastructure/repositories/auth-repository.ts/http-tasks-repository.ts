import { Inject } from "typescript-ioc";
import { Database } from "../../database/database";
import { DatabaseException } from "../../../domain/errors/errors";
import { TasksRepository } from "../../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../../domain/types/tasks-request-dto";
import { Task } from "../../../domain/entities/tasks";

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
            console.log(error)
            throw new DatabaseException("Ocorreu um erro ao criar tasks");
        }
    }
}