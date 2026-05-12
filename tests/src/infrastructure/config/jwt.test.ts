import { generateToken, verifyToken } from "../../../../src/infrastructure/config/jwt";

describe("jwt utilities", () => {
  const payload = { id: 1, email: "test@example.com" };

  it("should generate a string token", () => {
    const token = generateToken(payload);

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should verify a valid token and return the payload", () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token) as { id: number; email: string };

    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it("should throw when verifying an invalid token", () => {
    expect(() => verifyToken("invalid_token")).toThrow();
  });

  it("should throw when verifying a malformed token", () => {
    expect(() => verifyToken("header.payload.invalidsignature")).toThrow();
  });
});
