import { Container } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { HttpLoginRepository } from "../repositories/auth-repository/http-login-repository";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { HttpTasksRepository } from "../repositories/tasks-repository/http-tasks-repository";

Container.bind(LoginRepository).to(HttpLoginRepository);
Container.bind(TasksRepository).to(HttpTasksRepository);