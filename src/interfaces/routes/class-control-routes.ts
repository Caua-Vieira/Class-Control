import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

export const classControlRouter = (controller: AuthController): Router => {
    const router = Router();

    router.post("/auth", (req, res) => controller.login(req, res));

    return router;
};
