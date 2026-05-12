import { LoginUseCase } from "../../../../src/application/usecases/login-usecase";
import { LoginRepository } from "../../../../src/domain/contracts/login-repository";
import { InvalidCredentialsException } from "../../../../src/domain/errors/errors";
import bcrypt from "bcrypt";

jest.mock("bcrypt");
jest.mock("../../../../src/infrastructure/config/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("mocked_token"),
}));
jest.mock("../../../../src/infrastructure/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "hashed_password",
  createdAt: new Date(),
};

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let mockRepository: { findLoginByEmail: jest.Mock };

  beforeEach(() => {
    mockRepository = { findLoginByEmail: jest.fn() };
    loginUseCase = new LoginUseCase(mockRepository as unknown as LoginRepository);
  });

  it("should return a token on successful login", async () => {
    mockRepository.findLoginByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const token = await loginUseCase.execute("test@example.com", "password");

    expect(token).toBe("mocked_token");
    expect(mockRepository.findLoginByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should throw InvalidCredentialsException when user is not found", async () => {
    mockRepository.findLoginByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute("notfound@example.com", "password"))
      .rejects.toThrow(InvalidCredentialsException);
  });

  it("should throw InvalidCredentialsException when password is wrong", async () => {
    mockRepository.findLoginByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginUseCase.execute("test@example.com", "wrong_password"))
      .rejects.toThrow(InvalidCredentialsException);
  });
});
