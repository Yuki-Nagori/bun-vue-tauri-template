import { describe, expect, it } from "vitest";
import { formatGreeting } from "../../../src-web/utils/greet";

describe("formatGreeting", () => {
  it("greets the given name", () => {
    expect(formatGreeting("Tauri")).toBe("Hello, Tauri!");
  });

  it("falls back to world for blank input", () => {
    expect(formatGreeting("   ")).toBe("Hello, world!");
  });
});
