import { z } from "zod";

/** Schema walidacji adresu email */
export const emailSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
});

/** Schema walidacji logowania (email + hasło) */
export const enterPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

/** Schema walidacji rejestracji (email + hasło + potwierdzenie) */
export const createPasswordSchema = z
  .object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

export type EmailFormValues = z.infer<typeof emailSchema>;
export type EnterPasswordFormValues = z.infer<typeof enterPasswordSchema>;
export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
