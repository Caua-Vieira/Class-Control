import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { Container } from "typescript-ioc";
import { TasksController } from "../controllers/tasks-controller";

export const smartTasksManagement = (): Router => {
    const router = Router();
    const authController = Container.get(AuthController);
    const tasksController = Container.get(TasksController);

    router.post("/auth", (req, res) => authController.login(req, res));

    router.post("/tasks", (req, res) => tasksController.createTasks(req, res));

    router.delete("/tasks/:id", (req, res) => tasksController.deleteTasks(req, res));

    router.get("/tasks", (req, res) => tasksController.getTasks(req, res));

    return router;
};
