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

        await this.tasksUseCase.createTasks({
            title,
            description,
            dueDate,
            status,
            userId
        })

        res.status(204).send();
    }

    async deleteTasks(req: Request, res: Response) {
        await this.tasksUseCase.deleteTasks(Number(req.params.id))

        res.status(204).send();
    }

    async getTasks(req: Request, res: Response) {
        const response = await this.tasksUseCase.getTasks()

        res.status(200).send(response);
    }
}