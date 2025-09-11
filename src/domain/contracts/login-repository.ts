import { User } from "../entities/user";

export abstract class LoginRepository {
    abstract findLoginByEmail(email: string): Promise<User | null>;
}