import { Inject } from "typescript-ioc";
import { Database } from "../../database/database";
import { DatabaseException, NotFoundException } from "../../../domain/errors/errors";
import { TasksRepository } from "../../../domain/contracts/tasks-repository";
import { TasksRequestDTO } from "../../../domain/types/tasks-request-dto";
import { Task } from "../../../domain/entities/tasks";
import { TasksResponseDTO } from "../../../domain/types/tasks-response-dto";
import { mapTaskToDTO } from "../../../domain/mappers/map-tasks-response";
import { ITaskReminder } from "../../../domain/types/task-reminder";
import { logger } from "../../config/logger";

export class HttpTasksRepository implements TasksRepository {
    constructor(@Inject private database: Database) { }

    async createTasks(input: TasksRequestDTO): Promise<Task> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            const task = repository.create({
                title: input.title,
                description: input.description,
                dueDate: input.dueDate,
                status: input.status,
                user: { id: input.userId },
            });

            const saved = await repository.save(task);

            return saved;
        } catch (error) {
            logger.error({ error: (error as Error).message, userId: input.userId }, 'database error on createTasks');
            throw new DatabaseException("Ocorreu um erro ao criar tasks");
        }
    }

    async deleteTasks(id: number): Promise<void> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            await repository.delete(id);

        } catch (error) {
            logger.error({ error: (error as Error).message, taskId: id }, 'database error on deleteTasks');
            throw new DatabaseException("Ocorreu um erro ao deletar task");
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
            logger.error({ error: (error as Error).message }, 'database error on getTasks');
            throw new DatabaseException("Ocorreu um erro ao buscar tasks");
        }
    }

    async concludeTasks(id: number, data: Partial<Task>): Promise<void> {
        try {
            await this.database.appDataSource.getRepository(Task).update(id, data);
        } catch (error) {
            logger.error({ error: (error as Error).message, taskId: id }, 'database error on concludeTasks');
            throw new DatabaseException("Erro ao atualizar task");
        }
    }

    async findTasksDueBetween(start: Date, end: Date): Promise<ITaskReminder[]> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            const tasks = await repository
                .createQueryBuilder("t")
                .innerJoin("t.user", "u")
                .where("t.dueDate BETWEEN :start AND :end", { start, end })
                .select([
                    "u.email AS email",
                    "t.title AS title",
                    "t.description AS description",
                    "t.dueDate AS due_date"
                ])
                .getRawMany();

            return tasks;
        } catch (error) {
            logger.error({ error: (error as Error).message, start, end }, 'database error on findTasksDueBetween');
            throw new DatabaseException("Erro ao buscar tasks por vencimento");
        }
    }

    async updateTasks(id: number, data: Partial<Task>): Promise<void> {
        try {
            const repository = this.database.appDataSource.getRepository(Task);

            const task = await repository.findOne({ where: { id } });

            if (!task) {
                throw new NotFoundException("Task não encontrada");
            }

            Object.assign(task, data);

            await repository.save(task);

        } catch (error) {
            logger.error({ error: (error as Error).message, taskId: id }, 'database error on updateTasks');
            throw new DatabaseException("Erro ao atualizar task");
        }
    }
}