import { Inject } from "typescript-ioc";
import { Database } from "../../database/database";
import { DatabaseException } from "../../../domain/errors/errors";
import { TasksRepository } from "../../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../../domain/types/tasks-request-dto";

export class HttpTasksRepository implements TasksRepository {
    constructor(@Inject private database: Database) { }

    async createTasks(input: TasksRequestDTO): Promise<void> {
        try {

        } catch (error) {
            throw new DatabaseException("Ocorreu um erro ao criar tasks");
        }
    }
}