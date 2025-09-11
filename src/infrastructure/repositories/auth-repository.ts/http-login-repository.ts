import { Inject } from "typescript-ioc";
import { LoginRepository } from "../../../domain/contracts/login-repository";
import { User } from "../../../domain/entities/user";
import { DataSource, Repository } from "typeorm";

export class HttpLoginRepository implements LoginRepository {
    private repository: Repository<User>

    constructor(
        @Inject dataSource: DataSource
    ) {
        this.repository = dataSource.getRepository(User);
    }

    async findLoginByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }
}