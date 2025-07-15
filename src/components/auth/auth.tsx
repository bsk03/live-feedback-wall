"use client";
import { AuthStep, useAuthStore } from "@/store/authStore";
import React, { useMemo } from "react";
import { EmailStep } from "./email-step";
import { PasswordStep } from "./password-step";
import { ChevronLeft } from "lucide-react";

export const Auth = () => {
  const { step, setStep } = useAuthStore();

  const description = useMemo(() => {
    if (step === AuthStep.EMAIL) {
      return "Hej, podaj swój adres email";
    } else if (step === AuthStep.ENTER_PASSWORD) {
      return "Podaj hasło do swojego konta";
    } else if (step === AuthStep.CREATE_PASSWORD) {
      return "Stwórz hasło";
    }
  }, [step]);

  return (
    <div className="from-background via-background to-muted flex min-h-screen flex-col items-center justify-center bg-gradient-to-br">
      <div>
        {step !== AuthStep.EMAIL && (
          <button
            className="mb-2 flex cursor-pointer gap-2"
            onClick={() => setStep(AuthStep.EMAIL)}
          >
            <ChevronLeft /> Powrót
          </button>
        )}
        <div className="bg-background border-border flex flex-col items-center gap-4 rounded-lg border p-8 shadow-lg">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Panel administratora</h1>{" "}
            <p className="text-muted-foreground">{description}</p>
          </div>
          {step === AuthStep.EMAIL ? <EmailStep /> : <PasswordStep />}
        </div>
      </div>
    </div>
  );
};
