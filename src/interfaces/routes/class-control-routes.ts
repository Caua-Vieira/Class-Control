import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { Container } from "typescript-ioc";

export const classControlRouter = (): Router => {
    const router = Router();
    const controller = Container.get(AuthController);

    router.post("/auth", (req, res) => controller.login(req, res));

    return router;
};
