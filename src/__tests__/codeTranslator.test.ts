import { describe, it, expect } from "vitest";
import { codeTranslator } from "@/utils/codeTranslator";

describe("codeTranslator", () => {
  it("powinien zwrócić 'Nieprawidłowe hasło' dla kodu INVALID_EMAIL_OR_PASSWORD", () => {
    const result = codeTranslator("INVALID_EMAIL_OR_PASSWORD");
    expect(result).toBe("Nieprawidłowe hasło");
  });

  it("powinien zwrócić pusty string dla nieznanego kodu błędu", () => {
    const result = codeTranslator("UNKNOWN_ERROR");
    expect(result).toBe("");
  });

  it("powinien zwrócić pusty string dla pustego stringa", () => {
    const result = codeTranslator("");
    expect(result).toBe("");
  });
});
