import { Request, Response } from "express";
import { Inject } from "typescript-ioc";
import { TasksUseCase } from "../../application/usecases/tasks-usecase";

export class TasksController {

    constructor(
        @Inject private readonly tasksUseCase: TasksUseCase
    ) { }

    async createTasks(req: Request, res: Response) {
        const {
            title,
            description,
            dueDate,
            status,
            userId
        } = req.body

        await this.tasksUseCase.createTasksUseCase({
            title,
            description,
            dueDate,
            status,
            userId
        })

        res.status(204).send();
    }
}