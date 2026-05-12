import { errorHandler } from "../../../src/middleware/error-handler";
import {
  NotFoundException,
  DatabaseException,
  InvalidCredentialsException,
  MessageQueueException,
  QueueProcessingException,
  EmailSendException,
  InvalidDueDateException,
  CronJobException,
} from "../../../src/domain/errors/errors";
import { Request, Response, NextFunction } from "express";

describe("errorHandler", () => {
  let mockRes: Partial<Response>;
  const mockReq = {} as Request;
  const mockNext = jest.fn() as jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it.each([
    ["NotFoundException", new NotFoundException("not found"), 404, { error: "not found" }],
    ["DatabaseException", new DatabaseException("db error"), 500, { error: "Erro no banco de dados: db error" }],
    ["InvalidCredentialsException", new InvalidCredentialsException("invalid"), 401, { error: "invalid" }],
    ["MessageQueueException", new MessageQueueException("queue error"), 503, { error: "queue error" }],
    ["QueueProcessingException", new QueueProcessingException("processing error"), 500, { error: "processing error" }],
    ["EmailSendException", new EmailSendException("email error"), 503, { error: "email error" }],
    ["InvalidDueDateException", new InvalidDueDateException("invalid date"), 400, { error: "invalid date" }],
    ["CronJobException", new CronJobException("cron error"), 500, { error: "cron error" }],
  ])("should return %i for %s", (_name, error, expectedStatus, expectedBody) => {
    errorHandler(error, mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(expectedStatus);
    expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
  });

  it("should return 500 with generic message for unknown errors", () => {
    const error = new Error("unknown");

    errorHandler(error, mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Erro interno do servidor" });
  });
});
