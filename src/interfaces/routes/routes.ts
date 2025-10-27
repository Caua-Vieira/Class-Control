import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { Container } from "typescript-ioc";
import { TasksController } from "../controllers/tasks-controller";
import { authMiddleware } from "../../middleware/auth-middleware";

export const smartTasksManagement = (): Router => {
    const router = Router();
    const authController = Container.get(AuthController);
    const tasksController = Container.get(TasksController);

    router.post("/auth", (req, res) => authController.login(req, res));

    router.post("/tasks", authMiddleware, (req, res) => tasksController.createTasks(req, res));

    router.delete("/tasks/:id", authMiddleware, (req, res) => tasksController.deleteTasks(req, res));

    router.get("/tasks", authMiddleware, (req, res) => tasksController.getTasks(req, res));

    router.put("/tasks/:id/conclude", authMiddleware, (req, res) => tasksController.concludeTasks(req, res));

    router.put("/tasks/:id", authMiddleware, (req, res) => tasksController.updateTasks(req, res));

    return router;
};
