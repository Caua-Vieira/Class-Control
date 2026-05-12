import { TasksUseCase } from "../../../../src/application/usecases/tasks-usecase";
import { TasksRepository } from "../../../../src/domain/contracts/tasks-repository";
import { MessageQueue } from "../../../../src/domain/contracts/messaging/message-queue";
import { InvalidDueDateException, NotFoundException } from "../../../../src/domain/errors/errors";
import { Task } from "../../../../src/domain/entities/tasks";
import { TasksRequestDTO } from "../../../../src/domain/types/tasks-request-dto";
import { TasksResponseDTO } from "../../../../src/domain/types/tasks-response-dto";

jest.mock("../../../../src/infrastructure/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  dueDate: new Date(Date.now() + 86400000),
  status: "pendente",
  user: { id: 1, name: "Test User", email: "test@example.com" },
  createdAt: new Date(),
} as unknown as Task;

const futureDate = new Date(Date.now() + 86400000).toISOString();

const mockInput: TasksRequestDTO = {
  title: "Test Task",
  description: "Test Description",
  dueDate: futureDate,
  status: "pendente",
  userId: 1,
  userEmail: "test@example.com",
};

describe("TasksUseCase", () => {
  let tasksUseCase: TasksUseCase;
  let mockRepository: {
    createTasks: jest.Mock;
    deleteTasks: jest.Mock;
    getTasks: jest.Mock;
    concludeTasks: jest.Mock;
    updateTasks: jest.Mock;
    findTasksDueBetween: jest.Mock;
  };
  let mockQueue: { publish: jest.Mock };

  beforeEach(() => {
    mockRepository = {
      createTasks: jest.fn(),
      deleteTasks: jest.fn(),
      getTasks: jest.fn(),
      concludeTasks: jest.fn(),
      updateTasks: jest.fn(),
      findTasksDueBetween: jest.fn(),
    };
    mockQueue = { publish: jest.fn() };
    tasksUseCase = new TasksUseCase(
      mockRepository as unknown as TasksRepository,
      mockQueue as unknown as MessageQueue
    );
  });

  describe("createTasks", () => {
    it("should create a task and publish an event", async () => {
      mockRepository.createTasks.mockResolvedValue(mockTask);
      mockQueue.publish.mockResolvedValue(undefined);

      await tasksUseCase.createTasks(mockInput);

      expect(mockRepository.createTasks).toHaveBeenCalledWith(mockInput);
      expect(mockQueue.publish).toHaveBeenCalledWith(
        "task_created",
        expect.objectContaining({ id: mockTask.id, title: mockTask.title })
      );
    });

    it("should throw InvalidDueDateException when due date is in the past", async () => {
      const pastInput = { ...mockInput, dueDate: new Date(Date.now() - 86400000).toISOString() };

      await expect(tasksUseCase.createTasks(pastInput)).rejects.toThrow(InvalidDueDateException);
      expect(mockRepository.createTasks).not.toHaveBeenCalled();
    });
  });

  describe("deleteTasks", () => {
    it("should call repository to delete a task", async () => {
      mockRepository.deleteTasks.mockResolvedValue(undefined);

      await tasksUseCase.deleteTasks(1);

      expect(mockRepository.deleteTasks).toHaveBeenCalledWith(1);
    });
  });

  describe("getTasks", () => {
    it("should return the list of tasks", async () => {
      const mockTasks: TasksResponseDTO[] = [
        {
          id: 1,
          title: "Task",
          description: "Desc",
          dueDate: new Date(),
          status: "pendente",
          user: "Test User",
          createdAt: new Date(),
        },
      ];
      mockRepository.getTasks.mockResolvedValue(mockTasks);

      const result = await tasksUseCase.getTasks();

      expect(result).toEqual(mockTasks);
    });

    it("should throw NotFoundException when repository returns null", async () => {
      mockRepository.getTasks.mockResolvedValue(null);

      await expect(tasksUseCase.getTasks()).rejects.toThrow(NotFoundException);
    });
  });

  describe("concludeTasks", () => {
    it("should call repository with concluded status", async () => {
      mockRepository.concludeTasks.mockResolvedValue(undefined);

      await tasksUseCase.concludeTasks(1);

      expect(mockRepository.concludeTasks).toHaveBeenCalledWith(1, { status: "Concluída" });
    });
  });

  describe("updateTasks", () => {
    it("should call repository with the update data", async () => {
      const updateData = { title: "Updated Title" };
      mockRepository.updateTasks.mockResolvedValue(undefined);

      await tasksUseCase.updateTasks(1, updateData);

      expect(mockRepository.updateTasks).toHaveBeenCalledWith(1, updateData);
    });
  });
});
