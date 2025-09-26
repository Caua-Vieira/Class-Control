import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../../domain/entities/user";
import { Task } from "../../domain/entities/tasks";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "class_control",
    entities: [User, Task],
    synchronize: false,
    logging: true,
});
