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
  it("powinien zaakceptować poprawny email i hasło", () => {
    const result = enterPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojeHaslo123",
    });
    expect(result.success).toBe(true);
  });

  it("powinien odrzucić puste hasło", () => {
    const result = enterPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Hasło jest wymagane");
    }
  });
});

describe("createPasswordSchema", () => {
  it("powinien zaakceptować formularz z pasującymi, silnymi hasłami", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "MojeHaslo123!",
      confirmPassword: "MojeHaslo123!",
    });
    expect(result.success).toBe(true);
  });

  it("powinien odrzucić hasło bez wielkiej litery", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "mojehaslo123!",
      confirmPassword: "mojehaslo123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.message.includes("wielką literę"),
      );
      expect(error).toBeDefined();
    }
  });

  it("powinien odrzucić hasło bez znaku specjalnego", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "MojeHaslo123",
      confirmPassword: "MojeHaslo123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.message.includes("znak specjalny"),
      );
      expect(error).toBeDefined();
    }
  });

  it("powinien odrzucić formularz gdy hasła się nie zgadzają", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "MojeHaslo123!",
      confirmPassword: "InneHaslo456!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) =>
        i.path.includes("confirmPassword"),
      );
      expect(confirmError?.message).toBe("Hasła nie są takie same");
    }
  });

  it("powinien odrzucić formularz gdy brakuje potwierdzenia hasła", () => {
    const result = createPasswordSchema.safeParse({
      email: "user@test.pl",
      password: "MojeHaslo123!",
    });
    expect(result.success).toBe(false);
  });
});
