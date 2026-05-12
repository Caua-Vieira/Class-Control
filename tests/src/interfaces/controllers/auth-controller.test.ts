import { AuthController } from "../../../../src/interfaces/controllers/auth-controller";
import { LoginUseCase } from "../../../../src/application/usecases/login-usecase";
import { Request, Response } from "express";

jest.mock("../../../../src/infrastructure/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

describe("AuthController", () => {
  let authController: AuthController;
  let mockLoginUseCase: { execute: jest.Mock };
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockLoginUseCase = { execute: jest.fn() };
    authController = new AuthController(mockLoginUseCase as unknown as LoginUseCase);
    mockRes = {
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return the token when credentials are valid", async () => {
    const mockReq = {
      body: { email: "test@example.com", password: "password" },
    } as Request;
    mockLoginUseCase.execute.mockResolvedValue("mocked_token");

    await authController.login(mockReq, mockRes as Response);

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith("test@example.com", "password");
    expect(mockRes.json).toHaveBeenCalledWith("mocked_token");
  });

  it("should propagate errors thrown by the use case", async () => {
    const mockReq = {
      body: { email: "test@example.com", password: "wrong" },
    } as Request;
    mockLoginUseCase.execute.mockRejectedValue(new Error("Credenciais inválidas"));

    await expect(authController.login(mockReq, mockRes as Response)).rejects.toThrow("Credenciais inválidas");
  });
});
