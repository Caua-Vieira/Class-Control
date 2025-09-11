import { Container } from "typescript-ioc";
import { LoginRepository } from "../../domain/contracts/login-repository";
import { HttpLoginRepository } from "../repositories/auth-repository.ts/http-login-repository";

Container.bind(LoginRepository).to(HttpLoginRepository);