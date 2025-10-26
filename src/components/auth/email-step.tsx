"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthStep, useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EmailFormValues = z.infer<typeof emailSchema>;
const emailSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
});

export const EmailStep = () => {
  const { setStep, setEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const result = await checkUserExists.refetch();
      const isUserExists = result.data;
      console.log(isUserExists);
      if (isUserExists) {
        setStep(AuthStep.ENTER_PASSWORD);
      } else {
        setStep(AuthStep.CREATE_PASSWORD);
      }
      setEmail(values.email);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : undefined;
      toast.error("Nie udało się sprawdzić użytkownika", {
        description: errorMessage || "Spróbuj ponownie",
      });
    } finally {
      setIsLoading(false);
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
        disabled={checkUserExists.isFetching || isLoading}
      >
        {isLoading || checkUserExists.isFetching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Dalej"
        )}
      </Button>
    </form>
  );
};
