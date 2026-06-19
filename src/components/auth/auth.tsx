"use client";
import { AuthStep, useAuthStore } from "@/store/authStore";
import React, { useMemo } from "react";
import { EmailStep } from "./email-step";
import { PasswordStep } from "./password-step";
import { ChevronLeft, Lock } from "lucide-react";

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
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {step !== AuthStep.EMAIL && (
          <button
            className="text-muted-foreground hover:text-foreground mb-3 flex cursor-pointer items-center gap-1 text-sm transition-colors"
            onClick={() => setStep(AuthStep.EMAIL)}
          >
            <ChevronLeft className="h-4 w-4" /> Powrót
          </button>
        )}
        <div className="bg-card border-border flex flex-col items-center gap-4 rounded-xl border p-8 shadow-sm">
          <div className="bg-foreground flex h-11 w-11 items-center justify-center rounded-lg">
            <Lock className="text-background h-5 w-5" />
          </div>
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
