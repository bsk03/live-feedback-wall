import React from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";
import { Card } from "./card";

const features = [
  {
    icon: MessageCircle,
    title: "Zbieraj opinię w czasie rzeczywistym",
    description:
      "Otrzymuj natychmiastowe komentarze od uczestników podczas prezentacji, warsztatów czy spotkań.",
  },
  {
    icon: Shield,
    title: "Panel administratora",
    description:
      "Pełna kontrola nad wiadomościami - możliwość ukrywania i usuwania niepożądanych treści.",
  },
  {
    icon: Zap,
    title: "Szybkie i responsywne",
    description:
      "Nowoczesny interfejs dostosowany do wszystkich urządzeń z obsługą trybu ciemnego i jasnego.",
  },
  {
    icon: Users,
    title: "Łatwe w użyciu",
    description:
      "Intuicyjny interfejs, który pozwala każdemu szybko dodać swoją opinię bez rejestracji.",
  },
];

export const Landing = () => {
  return (
    <div className="from-background via-background to-muted min-h-screen bg-gradient-to-br">
      {" "}
      <header className="sticky top-0 z-50 container mx-auto bg-transparent px-4 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <h1 className="text-2xl font-bold">Live Feedback Wall</h1>
          </div>

          <ThemeToggle />
        </div>
      </header>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Zbieraj opinię
            <br />w czasie rzeczywistym
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Stwórz interaktywną ścianę komentarzy dla swoich prezentacji,
            warsztatów i spotkań. Pozwól uczestnikom dzielić się opiniami
            natychmiastowo.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link href="/app">Jestem uczestnikiem</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Link href="/app">Jestem organizatorem</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h3 className="mb-4 text-3xl font-bold">
            Dlaczego Live Feedback Wall?
          </h3>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Proste narzędzie do zbierania opinii, które zmieni sposób interakcji
            z Twoją publicznością
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              icon={<feature.icon className="h-6 w-6 text-white" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="bg-muted/30 rounded-3xl p-8 md:p-16">
          <div className="mb-16 text-center">
            <h3 className="mb-4 text-3xl font-bold">Jak to działa?</h3>
            <p className="text-muted-foreground text-lg">Prosto jak 1, 2, 3</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                1
              </div>
              <h4 className="mb-2 text-xl font-semibold">Udostępnij link</h4>
              <p className="text-muted-foreground">
                Podeślij uczestnikom link do ściany komentarzy
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                2
              </div>
              <h4 className="mb-2 text-xl font-semibold">Zbieraj opinie</h4>
              <p className="text-muted-foreground">
                Uczestnicy dodają komentarze w czasie rzeczywistym
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                3
              </div>
              <h4 className="mb-2 text-xl font-semibold">Moderuj treści</h4>
              <p className="text-muted-foreground">
                Kontroluj wyświetlane wiadomości z panelu administratora
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h3 className="mb-4 text-3xl font-bold">Gotowy do rozpoczęcia?</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Stwórz swoją pierwszą ścianę komentarzy już dziś i poznaj nowy
            sposób interakcji z publicznością.
          </p>
          <Button asChild size="lg" className="px-8 py-3 text-lg">
            <Link href="/app">Rozpocznij</Link>
          </Button>
        </div>
      </section>
      <footer className="mt-20 border-t">
        <div className="text-muted-foreground tex container mx-auto px-4 py-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Live Feedback Wall. Created by
            <Link
              href="https://github.com/bsk03"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent"
            >
              {" "}
              @bsk03
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};
