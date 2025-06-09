"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthStep, useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";

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

  const checkUserExists = api.user.checkIfUserExists.useQuery(
    { email: form.watch("email") },
    { enabled: false },
  );

  const onSubmit = async (values: EmailFormValues) => {
    try {
      const result = await checkUserExists.refetch();
      const isUserExists = result.data;

      if (isUserExists) {
        setStep(AuthStep.ENTER_PASSWORD);
      } else {
        setStep(AuthStep.CREATE_PASSWORD);
      }
      setEmail(values.email);
    } catch (error) {
      console.error(error);
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
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="flex w-full items-center space-x-2"
        disabled={checkUserExists.isFetching}
      >
        Dalej
      </Button>
    </form>
  );
};
