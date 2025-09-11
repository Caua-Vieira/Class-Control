import { Request, Response } from "express";
import { Inject } from "typescript-ioc";
import { LoginUseCase } from "../../application/usecases/login-usecase";

export class AuthController {

    constructor(
        @Inject private readonly loginUseCase: LoginUseCase
    ) { }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const token = await this.loginUseCase.execute(email, password);

        res.json(token);
    }
}