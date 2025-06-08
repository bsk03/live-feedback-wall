import { create } from "zustand";

export enum AuthStep {
  EMAIL,
  ENTER_PASSWORD,
  CREATE_PASSWORD,
}

type AuthState = {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  email: string;
  setEmail: (email: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  step: AuthStep.EMAIL,
  setStep: (step: AuthStep) => set({ step }),
  email: "",
  setEmail: (email: string) => set({ email }),
}));
