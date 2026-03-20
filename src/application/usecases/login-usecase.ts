import bcrypt from "bcrypt";
import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { generateToken } from "../../infrastructure/config/jwt";
import { InvalidCredentialsException } from "../../domain/errors/errors";
import { logger } from "../../infrastructure/config/logger";

export class LoginUseCase {

    constructor(
        @Inject private readonly loginRepository: LoginRepository
    ) { }

    async execute(email: string, password: string) {
        logger.info({ email }, 'login attempt')

        const user = await this.loginRepository.findLoginByEmail(email);
        if (!user) {
            logger.warn({ email }, 'login failed: user not found');
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn({ email }, 'login failed: invalid password');
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        logger.info({ email, userId: user.id }, 'login successful');
        const token = generateToken({ id: user.id, email: user.email });
        return token;
    }
}