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

const createPasswordSchema = z
  .object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

const enterPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
type EnterPasswordFormValues = z.infer<typeof enterPasswordSchema>;

export const PasswordStep = () => {
  const { setStep, email, step } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const isCreatePassword = step === AuthStep.CREATE_PASSWORD;

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
        const { data, error } = await authClient.signUp.email(
          {
            email: values.email,
            password: values.password,
            callbackURL: "/panel",
          },
          {},
        );
        toast("Pomyślnie utworzono konto");
      } catch (error) {
        console.log(error);
        toast("Nie udało się utworzyć konta");
      }
    } else {
      try {
        const { data, error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/panel",
        });
        toast("Pomyślnie zalogowano");
      } catch (error) {
        console.log(error);
        toast("Nie udało się zalogować");
      }
    }
    setIsLoading(false);
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
