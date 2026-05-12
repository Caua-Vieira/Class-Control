import { taskCreatedTemplate } from "../../../../../src/infrastructure/email/template/task-created-template";

describe("taskCreatedTemplate", () => {
  const title = "Test Task";
  const description = "Test Description";
  const dueDate = "2025-12-31";

  it("should return a string", () => {
    const result = taskCreatedTemplate(title, description, dueDate);

    expect(typeof result).toBe("string");
  });

  it("should include the title", () => {
    const result = taskCreatedTemplate(title, description, dueDate);

    expect(result).toContain(title);
  });

  it("should include the description", () => {
    const result = taskCreatedTemplate(title, description, dueDate);

    expect(result).toContain(description);
  });

  it("should include the formatted due date", () => {
    const result = taskCreatedTemplate(title, description, dueDate);
    const formattedDate = new Date(dueDate).toLocaleDateString();

    expect(result).toContain(formattedDate);
  });
});
