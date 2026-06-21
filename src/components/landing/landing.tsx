import React from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";
import { Card } from "./card";

const features = [
  {
    icon: MessageCircle,
    title: "Zbieraj opinie w czasie rzeczywistym",
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
    <div className="bg-background min-h-screen">
      {" "}
      <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <nav
          aria-label="Nawigacja główna"
          className="container mx-auto px-4 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="bg-foreground flex h-9 w-9 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <MessageCircle className="text-background h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Live Feedback Wall
              </h1>
            </div>

            <ThemeToggle />
          </div>
        </nav>
      </header>
      <section
        className="container mx-auto px-4 py-20 text-center"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="hero-heading"
            className="text-foreground mb-6 text-5xl font-bold tracking-tight md:text-7xl"
          >
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
              <Link href="/rooms/join">Jestem uczestnikiem</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Link href="/auth">Jestem organizatorem</Link>
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
              icon={<feature.icon className="text-background h-5 w-5" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="bg-muted/40 border-border/60 rounded-3xl border p-8 md:p-16">
          <div className="mb-16 text-center">
            <h3 className="mb-4 text-3xl font-bold">Jak to działa?</h3>
            <p className="text-muted-foreground text-lg">Prosto jak 1, 2, 3</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-foreground text-background mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                1
              </div>
              <h4 className="mb-2 text-xl font-semibold">Udostępnij link</h4>
              <p className="text-muted-foreground">
                Podeślij uczestnikom link do ściany komentarzy
              </p>
            </div>

            <div className="text-center">
              <div className="bg-foreground text-background mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                2
              </div>
              <h4 className="mb-2 text-xl font-semibold">Zbieraj opinie</h4>
              <p className="text-muted-foreground">
                Uczestnicy dodają komentarze w czasie rzeczywistym
              </p>
            </div>

            <div className="text-center">
              <div className="bg-foreground text-background mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
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
      <footer className="mt-20 border-t" role="contentinfo">
        <div className="text-muted-foreground container mx-auto px-4 py-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Live Feedback Wall . Created by
            <Link
              href="https://github.com/bsk03"
              className="text-foreground font-semibold hover:underline"
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
