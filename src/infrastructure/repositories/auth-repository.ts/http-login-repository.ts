import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../../domain/contracts/login-repository";
import { User } from "../../../domain/entities/user";
import { Database } from "../../database/database";

export class HttpLoginRepository implements LoginRepository {
    constructor(@Inject private database: Database) { }

    async findLoginByEmail(email: string): Promise<User | null> {
        return this.database.appDataSource.getRepository(User).findOne({ where: { email } });
    }
}