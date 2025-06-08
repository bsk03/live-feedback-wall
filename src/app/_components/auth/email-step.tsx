"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmailStep } from "./email-step.hooks";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthStep, useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";

type EmailFormValues = z.infer<typeof emailSchema>;
const emailSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
});

export const EmailStep = () => {
  const { setStep, setEmail } = useAuthStore();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: EmailFormValues) => {
    setStep(AuthStep.ENTER_PASSWORD);
    setEmail(values.email);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adres email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Wprowadź adres email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" className="flex w-full items-center space-x-2">
        Dalej
      </Button>
    </form>
  );
};
