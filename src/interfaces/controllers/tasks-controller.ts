import { Request, Response } from "express";
import { Inject } from "typescript-ioc";
import { TasksUseCase } from "../../application/usecases/tasks-usecase";

export class TasksController {

    constructor(
        @Inject private readonly tasksUseCase: TasksUseCase
    ) { }

    async createTasks(req: Request, res: Response) {

        const input = {
            ...req.body,
            userEmail: (req as any).user.email
        }

        await this.tasksUseCase.createTasks(input)

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

    async concludeTasks(req: Request, res: Response) {
        const { id } = req.params;

        await this.tasksUseCase.concludeTasks(Number(id));

        res.status(204).send();
    }

    async updateTasks(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body;

        await this.tasksUseCase.updateTasks(Number(id), data);

        res.status(204).send();
    }
}