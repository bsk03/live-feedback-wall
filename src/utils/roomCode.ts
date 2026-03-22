/**
 * Generuje losowy kod pokoju w formacie XXX-XXX
 * gdzie X to litera (a-z, A-Z) lub cyfra (0-9).
 */
export const generateRoomCode = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const firstPart = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
  const secondPart = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
  return `${firstPart}-${secondPart}`;
};
