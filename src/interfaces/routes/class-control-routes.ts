import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { Container } from "typescript-ioc";
import { TasksController } from "../controllers/tasks-controller";

export const classControlRouter = (): Router => {
    const router = Router();
    const authController = Container.get(AuthController);
    const tasksController = Container.get(TasksController);

    router.post("/auth", (req, res) => authController.login(req, res));

    router.post("/tasks", (req, res) => tasksController.createTasks(req, res));

    return router;
};
