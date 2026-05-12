import { mapTaskToDTO } from "../../../../src/domain/mappers/map-tasks-response";
import { Task } from "../../../../src/domain/entities/tasks";
import { User } from "../../../../src/domain/entities/user";

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
} as User;

const mockDueDate = new Date("2025-12-31");
const mockCreatedAt = new Date("2025-01-01");

const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    dueDate: mockDueDate,
    status: "pendente",
    user: mockUser,
    createdAt: mockCreatedAt,
  } as Task,
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    dueDate: mockDueDate,
    status: "Concluída",
    user: mockUser,
    createdAt: mockCreatedAt,
  } as Task,
];

describe("mapTaskToDTO", () => {
  it("should return an empty array when given an empty array", () => {
    expect(mapTaskToDTO([])).toEqual([]);
  });

  it("should map all tasks to DTOs", () => {
    const result = mapTaskToDTO(mockTasks);

    expect(result).toHaveLength(2);
  });

  it("should correctly map task fields to DTO", () => {
    const result = mapTaskToDTO([mockTasks[0]]);

    expect(result[0]).toEqual({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      dueDate: mockDueDate,
      status: "pendente",
      user: "Test User",
      createdAt: mockCreatedAt,
    });
  });

  it("should use the user name from the task's user relation", () => {
    const result = mapTaskToDTO(mockTasks);

    result.forEach((dto) => expect(dto.user).toBe(mockUser.name));
  });
});
