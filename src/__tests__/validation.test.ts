import { describe, it, expect } from "vitest";
import {
  emailSchema,
  enterPasswordSchema,
  createPasswordSchema,
} from "@/utils/validation";

describe("emailSchema", () => {
  it("powinien zaakceptować poprawny adres email", () => {
    const result = emailSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("powinien odrzucić niepoprawny adres email", () => {
    const result = emailSchema.safeParse({ email: "niepoprawny-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Nieprawidłowy adres email",
      );
    }
  });

  it("powinien odrzucić pusty string", () => {
    const result = emailSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});

describe("enterPasswordSchema", () => {
  it("powinien zaakceptować poprawny email i hasło (min 8 znaków)", () => {
    const result = enterPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojeHaslo123",
    });
    expect(result.success).toBe(true);
  });

  it("powinien odrzucić hasło krótsze niż 8 znaków", () => {
    const result = enterPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Hasło musi mieć co najmniej 8 znaków",
      );
    }
  });
});

describe("createPasswordSchema", () => {
  it("powinien zaakceptować formularz z pasującymi hasłami", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojeHaslo123",
      confirmPassword: "mojeHaslo123",
    });
    expect(result.success).toBe(true);
  });

  it("powinien odrzucić formularz gdy hasła się nie zgadzają", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojeHaslo123",
      confirmPassword: "inneHaslo456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (i) => i.path.includes("confirmPassword"),
      );
      expect(confirmError?.message).toBe("Hasła nie są takie same");
    }
  });

  it("powinien odrzucić formularz gdy brakuje potwierdzenia hasła", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojeHaslo123",
    });
    expect(result.success).toBe(false);
  });
});
