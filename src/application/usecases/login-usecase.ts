import bcrypt from "bcrypt";
import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { generateToken } from "../../infrastructure/config/jwt";

export class LoginUseCase {

    constructor(
        @Inject private readonly loginRepository: LoginRepository
    ) { }

    async execute(email: string, password: string) {
        const user = await this.loginRepository.findLoginByEmail(email);
        if (!user) throw new Error("Credenciais inválidas");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Credenciais inválidas");

        const token = generateToken({ id: user.id, role: user.role, email: user.email });
        return token;
    }
}