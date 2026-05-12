import { TasksController } from "../../../../src/interfaces/controllers/tasks-controller";
import { TasksUseCase } from "../../../../src/application/usecases/tasks-usecase";
import { Request, Response } from "express";

jest.mock("../../../../src/infrastructure/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockTasksResponse = [
  {
    id: 1,
    title: "Task 1",
    description: "Desc",
    dueDate: new Date(),
    status: "pendente",
    user: "Test User",
    createdAt: new Date(),
  },
];

describe("TasksController", () => {
  let tasksController: TasksController;
  let mockTasksUseCase: {
    createTasks: jest.Mock;
    deleteTasks: jest.Mock;
    getTasks: jest.Mock;
    concludeTasks: jest.Mock;
    updateTasks: jest.Mock;
  };
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockTasksUseCase = {
      createTasks: jest.fn(),
      deleteTasks: jest.fn(),
      getTasks: jest.fn(),
      concludeTasks: jest.fn(),
      updateTasks: jest.fn(),
    };
    tasksController = new TasksController(mockTasksUseCase as unknown as TasksUseCase);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("createTasks", () => {
    it("should call use case with body merged with user email and return 204", async () => {
      const mockReq = {
        body: { title: "Task", description: "Desc", dueDate: "2025-12-31", status: "pendente", userId: 1 },
        user: { email: "test@example.com" },
      } as unknown as Request;
      mockTasksUseCase.createTasks.mockResolvedValue(undefined);

      await tasksController.createTasks(mockReq, mockRes as Response);

      expect(mockTasksUseCase.createTasks).toHaveBeenCalledWith({
        title: "Task",
        description: "Desc",
        dueDate: "2025-12-31",
        status: "pendente",
        userId: 1,
        userEmail: "test@example.com",
      });
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe("deleteTasks", () => {
    it("should call use case with the numeric id and return 204", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockTasksUseCase.deleteTasks.mockResolvedValue(undefined);

      await tasksController.deleteTasks(mockReq, mockRes as Response);

      expect(mockTasksUseCase.deleteTasks).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe("getTasks", () => {
    it("should return 200 with the list of tasks", async () => {
      const mockReq = {} as Request;
      mockTasksUseCase.getTasks.mockResolvedValue(mockTasksResponse);

      await tasksController.getTasks(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockTasksResponse);
    });
  });

  describe("concludeTasks", () => {
    it("should call use case with the numeric id and return 204", async () => {
      const mockReq = { params: { id: "5" } } as unknown as Request;
      mockTasksUseCase.concludeTasks.mockResolvedValue(undefined);

      await tasksController.concludeTasks(mockReq, mockRes as Response);

      expect(mockTasksUseCase.concludeTasks).toHaveBeenCalledWith(5);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe("updateTasks", () => {
    it("should call use case with the numeric id and body data and return 204", async () => {
      const mockReq = {
        params: { id: "3" },
        body: { title: "Updated" },
      } as unknown as Request;
      mockTasksUseCase.updateTasks.mockResolvedValue(undefined);

      await tasksController.updateTasks(mockReq, mockRes as Response);

      expect(mockTasksUseCase.updateTasks).toHaveBeenCalledWith(3, { title: "Updated" });
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });
});
