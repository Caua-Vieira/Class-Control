import { LoginUseCase } from "../../../../src/application/usecases/login-usecase";
import { AuthController } from "../../../../src/interfaces/controllers/auth-controller";

describe("AuthController - login", () => {
    let controller: AuthController;
    let loginUseCase: jest.Mocked<LoginUseCase>;
    let req: any;
    let res: any;

    beforeEach(() => {
        loginUseCase = {
            execute: jest.fn(),
        } as any;

        controller = new AuthController(loginUseCase);

        req = {
            body: {
                email: "test@example.com",
                password: "123456",
            },
        };

        res = {
            json: jest.fn(),
        };
    });

    it("deve chamar o usecase e retornar o token", async () => {
        const fakeToken = "jwt123";
        loginUseCase.execute.mockResolvedValue(fakeToken);

        await controller.login(req, res);

        expect(loginUseCase.execute).toHaveBeenCalledWith(
            "test@example.com",
            "123456"
        );

        expect(res.json).toHaveBeenCalledWith(fakeToken);
    });

    it("deve propagar erro se o usecase falhar", async () => {
        loginUseCase.execute.mockRejectedValue(new Error("Credenciais inválidas"));

        await expect(controller.login(req, res))
            .rejects
            .toThrow("Credenciais inválidas");
    });
});
