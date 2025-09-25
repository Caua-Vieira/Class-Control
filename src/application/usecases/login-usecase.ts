import bcrypt from "bcrypt";
import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { generateToken } from "../../infrastructure/config/jwt";
import { InvalidCredentialsException } from "../../domain/errors/errors";

export class LoginUseCase {

    constructor(
        @Inject private readonly loginRepository: LoginRepository
    ) { }

    async execute(email: string, password: string) {
        const user = await this.loginRepository.findLoginByEmail(email);
        if (!user) throw new InvalidCredentialsException("Credenciais inválidas");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new InvalidCredentialsException("Credenciais inválidas");

        const token = generateToken({ id: user.id, email: user.email });
        return token;
    }
}