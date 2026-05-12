import { authMiddleware } from "../../../src/middleware/auth-middleware";
import { generateToken } from "../../../src/infrastructure/config/jwt";
import { Request, Response, NextFunction } from "express";

describe("authMiddleware", () => {
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 when no authorization header is provided", () => {
    const mockReq = { headers: {} } as Request;

    authMiddleware(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Token não informado" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const mockReq = {
      headers: { authorization: "Bearer invalid_token" },
    } as Request;

    authMiddleware(mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Token inválido ou expirado" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() and attach user to req when token is valid", () => {
    const token = generateToken({ id: 1, email: "test@example.com" });
    const mockReq = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;

    authMiddleware(mockReq, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((mockReq as any).user).toBeDefined();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
