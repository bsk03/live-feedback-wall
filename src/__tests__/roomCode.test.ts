import { describe, it, expect } from "vitest";
import { generateRoomCode } from "@/utils/roomCode";

describe("generateRoomCode", () => {
  it("powinien wygenerować kod w formacie XXX-XXX (3 znaki, myślnik, 3 znaki)", () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/);
  });

  it("powinien generować unikalne kody przy kolejnych wywołaniach", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      codes.add(generateRoomCode());
    }
    // Przy 62^6 możliwych kombinacji, 50 kodów powinno być unikalnych
    expect(codes.size).toBe(50);
  });

  it("powinien zawsze zwracać string o długości 7 znaków (3 + myślnik + 3)", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateRoomCode();
      expect(code).toHaveLength(7);
    }
  });

  it("powinien zawierać tylko znaki alfanumeryczne i myślnik", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateRoomCode();
      expect(code).toMatch(/^[A-Za-z0-9-]+$/);
    }
  });
});
