import { checkUpcomingTasks } from "../../../src/workers/task-reminder-worker";
import { Container } from "typescript-ioc";
import { TasksRepository } from "../../../src/domain/contracts/tasks-repository";
import { EmailService } from "../../../src/domain/contracts/email/email-service";
import { CronJobException } from "../../../src/domain/errors/errors";
import { ITaskReminder } from "../../../src/domain/types/task-reminder";

jest.mock("typescript-ioc", () => ({
  Container: { get: jest.fn() },
}));

jest.mock("../../../src/infrastructure/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockTasksRepo = { findTasksDueBetween: jest.fn() };
const mockEmailService = { sendEmail: jest.fn() };

function taskDueInDays(days: number): ITaskReminder {
  return {
    email: "user@example.com",
    title: "Test Task",
    description: "Test Description",
    due_date: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  };
}

describe("checkUpcomingTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Container.get as jest.Mock).mockImplementation((cls) => {
      if (cls === TasksRepository) return mockTasksRepo;
      if (cls === EmailService) return mockEmailService;
    });
  });

  it("should not send any email when there are no upcoming tasks", async () => {
    mockTasksRepo.findTasksDueBetween.mockResolvedValue([]);

    await checkUpcomingTasks();

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it("should send an email with the 7-day subject for tasks due in 7 days", async () => {
    mockTasksRepo.findTasksDueBetween.mockResolvedValue([taskDueInDays(7)]);
    mockEmailService.sendEmail.mockResolvedValue(undefined);

    await checkUpcomingTasks();

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Sua tarefa vence em 7 dias!",
      expect.any(String)
    );
  });

  it("should send an email with the 3-day subject for tasks due in 3 days", async () => {
    mockTasksRepo.findTasksDueBetween.mockResolvedValue([taskDueInDays(3)]);
    mockEmailService.sendEmail.mockResolvedValue(undefined);

    await checkUpcomingTasks();

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Sua tarefa vence em 3 dias!",
      expect.any(String)
    );
  });

  it("should skip tasks that are not in the 7-day or 3-day reminder window", async () => {
    mockTasksRepo.findTasksDueBetween.mockResolvedValue([taskDueInDays(5)]);

    await checkUpcomingTasks();

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it("should throw CronJobException when the repository throws", async () => {
    mockTasksRepo.findTasksDueBetween.mockRejectedValue(new Error("db error"));

    await expect(checkUpcomingTasks()).rejects.toThrow(CronJobException);
  });
});
