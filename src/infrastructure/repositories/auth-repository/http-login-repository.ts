import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../../domain/contracts/login-repository";
import { User } from "../../../domain/entities/user";
import { Database } from "../../database/database";
import { DatabaseException } from "../../../domain/errors/errors";
import { logger } from "../../config/logger";

export class HttpLoginRepository implements LoginRepository {
    constructor(@Inject private database: Database) { }

    async findLoginByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.database.appDataSource.getRepository(User).findOne({ where: { email } });

            if (!user) {
                logger.warn({ email }, 'user not found on database');
            }

            return user;
        } catch (error) {
            logger.error({ email, error: (error as Error).message }, 'database error on findLoginByEmail');
            throw new DatabaseException("Ocorreu um erro ao buscar informações");
        }
    }
}