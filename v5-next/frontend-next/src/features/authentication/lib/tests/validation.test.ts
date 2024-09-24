import { describe, expect, it } from "vitest";
import { validateForm } from "../validation";

const initialValues = { email: "", password: "" };

describe("Validation", () => {
  it.each([
    "test",
    "test.no",
    "test$test.no",
    "te@r.no",
    "@.",
    "test@test.com",
  ])("should return false if email missing requirements", (input) => {
    const isValid = validateForm({ email: input, password: "123456" });
    expect(isValid).toBeFalsy();
  });

  it("should return false if email field is missing", () => {
    const isValid = validateForm({ password: "123456" });
    expect(isValid).toBeFalsy();
  });

  it("should return false if password field is missing", () => {
    const isValid = validateForm({ email: "test@test.no" });
    expect(isValid).toBeFalsy();
  });
  it("should return false if no fields provided", () => {
    const isValid = validateForm({});
    expect(isValid).toBeFalsy();
  });

  it("should return false if password field is to short", () => {
    const isValid = validateForm({ email: "test@test.no", password: "123" });
    expect(isValid).toBeFalsy();
  });
  it("should return true if email and password field meets requirements", () => {
    const isValid = validateForm({ email: "test@test.no", password: "123456" });
    expect(isValid).toBeTruthy();
  });
  it("should return true if email and password field meets requirements", () => {
    const isValid = validateForm({
      email: "test@test.no",
      password: "123456",
      name: "Test",
    });
    expect(isValid).toBeTruthy();
  });
  it("should handle keys with uppercase", () => {
    const isValid = validateForm({
      Email: "test@test.no",
      password: "123456",
    });
    expect(isValid).toBeTruthy();
  });
});
