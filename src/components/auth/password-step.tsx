"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthStep, useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { codeTranslator } from "@/utils/codeTranslator";
import { useRouter } from "next/navigation";

const createPasswordSchema = z
  .object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
      .regex(
        /[^A-Za-z0-9]/,
        "Hasło musi zawierać co najmniej jeden znak specjalny",
      ),
    confirmPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

const enterPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
type EnterPasswordFormValues = z.infer<typeof enterPasswordSchema>;

export const PasswordStep = () => {
  const { email, step } = useAuthStore();
  const isCreatePassword = step === AuthStep.CREATE_PASSWORD;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<CreatePasswordFormValues | EnterPasswordFormValues>({
    resolver: zodResolver(
      isCreatePassword ? createPasswordSchema : enterPasswordSchema,
    ),
    defaultValues: {
      email: email ?? "",
      password: "",
      ...(isCreatePassword && { confirmPassword: "" }),
    },
  });

  const onSubmit = async (
    values: CreatePasswordFormValues | EnterPasswordFormValues,
  ) => {
    setIsLoading(true);
    if (isCreatePassword) {
      try {
        const { error } = await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: "",
        });
        if (error) {
          throw error;
        }
        toast.success("Pomyślnie utworzono konto");
        router.push("/panel");
      } catch (error) {
        console.log(error);
        const errorCode =
          error && typeof error === "object" && "code" in error
            ? String(error.code)
            : undefined;
        const description = codeTranslator(errorCode || "unknown_error");
        toast.error("Nie udało się utworzyć konta", {
          description,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/panel",
        });
        if (error) {
          throw error;
        }
        toast.success("Pomyślnie zalogowano");
      } catch (error) {
        console.log(error);
        const errorCode =
          error && typeof error === "object" && "code" in error
            ? String(error.code)
            : undefined;
        const description = codeTranslator(errorCode || "unknown_error");
        toast.error("Nie udało się zalogować", {
          description,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adres email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Wprowadź adres email"
          disabled
          {...form.register("email")}
        />
        {form.formState.errors.email?.message && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}

        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          type="password"
          placeholder="Wprowadź hasło"
          {...form.register("password")}
        />
        {form.formState.errors.password?.message && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}

        {isCreatePassword && (
          <>
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Wprowadź hasło ponownie"
              {...form.register("confirmPassword")}
            />
            {"confirmPassword" in form.formState.errors &&
              form.formState.errors.confirmPassword?.message && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
          </>
        )}
      </div>
      <Button
        type="submit"
        className="flex w-full items-center space-x-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span>Dalej</span>
        )}
      </Button>
    </form>
  );
};
