import { Container } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { HttpLoginRepository } from "../repositories/auth-repository/http-login-repository";
import { TasksRepository } from "../../domain/contracts/tasks-repository";
import { HttpTasksRepository } from "../repositories/tasks-repository/http-tasks-repository";
import { MessageQueue } from "../../domain/contracts/messaging/message-queue";
import { RabbitMQService } from "../messaging/rabbitmq-service";

Container.bind(LoginRepository).to(HttpLoginRepository);
Container.bind(TasksRepository).to(HttpTasksRepository);
Container.bind(MessageQueue).to(RabbitMQService);