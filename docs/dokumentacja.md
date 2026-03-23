# Live Feedback Wall (LFW)

## Dokumentacja projektowa

---

**Nazwa projektu:** Live Feedback Wall (LFW)

**Autor:** Błażej Kowalczyk [BK]

**Uczelnia:** Uniwersytet Śląski w Katowicach

**Wydział:** Wydział Nauk Ścisłych i Technicznych

**Kierunek:** Informatyka

**Przedmiot:** Projekt Systemu

**Prowadząca:** dr Magdalena Tkacz

**Rok akademicki:** 2025/2026

**Repozytorium:** [https://github.com/bsk03/live-feedback-wall](https://github.com/bsk03/live-feedback-wall)

**Aplikacja live:** [https://live-feedback-wall.onrender.com](https://live-feedback-wall.onrender.com)

---

\newpage

## Spis treści

1. [Słownik](#2-słownik)
2. [Cel, zakres projektu, odbiorca](#3-cel-zakres-projektu-odbiorca)
3. [Architektura](#4-architektura)
4. [Wymagania](#5-wymagania)
5. [Ograniczenia](#6-ograniczenia)
6. [Użytkownicy](#7-użytkownicy)
7. [Przypadki użycia](#8-przypadki-użycia)
8. [Baza danych](#9-baza-danych)
9. [Diagramy sekwencji](#10-diagramy-sekwencji)
10. [Diagramy aktywności](#11-diagramy-aktywności)
11. [Diagramy stanów](#12-diagramy-stanów)
12. [Dokumentacja bezpieczeństwa](#13-dokumentacja-bezpieczeństwa)
13. [Dostępność (WCAG)](#14-dostępność-wcag)
14. [Diagram klas](#15-diagram-klas)
15. [Kod SQL](#16-kod-sql)
16. [Przypadki testowe](#17-przypadki-testowe)
17. [Testy jednostkowe](#18-testy-jednostkowe)
18. [Diagram komponentów i wdrożenia](#19-diagram-komponentów-i-wdrożenia)
19. [Instalacja i konfiguracja (CI/CD)](#20-instalacja-i-konfiguracja-cicd)
20. [Implementacja mechanizmów bezpieczeństwa](#21-implementacja-mechanizmów-bezpieczeństwa)
21. [Podręcznik użytkownika](#22-podręcznik-użytkownika)

\newpage

## 2. Słownik

| Pojęcie                     | Definicja                                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pokój (Room)**            | Wirtualna przestrzeń utworzona przez organizatora, do której uczestnicy mogą dołączać i wysyłać wiadomości w czasie rzeczywistym.                   |
| **Kod pokoju**              | Unikalny 7-znakowy identyfikator w formacie `XXX-XXX` (litery i cyfry), służący do dołączania do pokoju.                                            |
| **Organizator**             | Zarejestrowany użytkownik, który tworzy pokoje, udostępnia kody dostępu i moderuje wiadomości.                                                      |
| **Uczestnik**               | Anonimowy użytkownik, który dołącza do pokoju za pomocą kodu i wysyła wiadomości. Nie wymaga rejestracji.                                           |
| **Feedback Wall**           | Interaktywna ściana komentarzy wyświetlająca wiadomości uczestników w czasie rzeczywistym.                                                          |
| **WebSocket**               | Protokół komunikacji dwukierunkowej między przeglądarką a serwerem, umożliwiający przesyłanie danych w czasie rzeczywistym bez odpytywania serwera. |
| **Socket.IO**               | Biblioteka JavaScript implementująca komunikację WebSocket z mechanizmami automatycznego ponownego łączenia i fallbackiem na HTTP long-polling.     |
| **Sesja**                   | Obiekt przechowywany po stronie serwera, zawierający dane uwierzytelnienia użytkownika (token, czas wygaśnięcia, adres IP).                         |
| **Soft delete**             | Technika usuwania danych polegająca na oznaczeniu rekordu jako usuniętego (flaga `deleted`) bez fizycznego usunięcia z bazy danych.                 |
| **OTP (One-Time Password)** | W kontekście projektu: 6-znakowy kod alfanumeryczny wprowadzany przez uczestnika w celu dołączenia do pokoju.                                       |
| **tRPC**                    | Biblioteka do tworzenia typowo-bezpiecznych API w TypeScript, eliminująca potrzebę generowania klientów API.                                        |
| **Drizzle ORM**             | Lekki ORM (Object-Relational Mapping) dla TypeScript, służący do definiowania schematu bazy danych i wykonywania zapytań.                           |
| **QR Code**                 | Dwuwymiarowy kod kreskowy generowany dla każdego pokoju, umożliwiający szybkie dołączenie przez zeskanowanie aparatem.                              |
| **Rate limiting**           | Mechanizm ograniczający liczbę żądań (wiadomości) wysyłanych przez użytkownika w określonym przedziale czasu.                                       |
| **Infinite scroll**         | Wzorzec interfejsu użytkownika, w którym kolejne dane (wiadomości) ładowane są automatycznie przy przewijaniu.                                      |

\newpage

## 3. Cel, zakres projektu, odbiorca

### Cel projektu

Celem projektu jest stworzenie aplikacji webowej umożliwiającej zbieranie opinii i komentarzy od uczestników wydarzeń (prezentacji, warsztatów, wykładów, spotkań) w czasie rzeczywistym. Aplikacja ma zastąpić tradycyjne metody zbierania feedbacku (kartki, formularze po wydarzeniu) interaktywną, natychmiastową formą komunikacji.

### Zakres projektu

Projekt obejmuje:

- System rejestracji i logowania organizatorów (email + hasło)
- Panel organizatora do tworzenia i zarządzania pokojami
- Generowanie unikalnych kodów dostępu i kodów QR do pokoi
- Widok uczestnika z możliwością dołączenia przez kod i wysyłania wiadomości
- Komunikację w czasie rzeczywistym (WebSocket)
- Moderację wiadomości (soft delete)
- Paginację wiadomości (infinite scroll)
- Responsywny interfejs (mobile + desktop) z trybem ciemnym/jasnym
- Mechanizmy bezpieczeństwa (rate limiting, walidacja, security headers)
- Podstawową zgodność z WCAG 2.1

### Odbiorca docelowy

- **Prowadzący prezentacje i wykłady** — zbieranie pytań i opinii od publiczności
- **Moderatorzy warsztatów** — interakcja z uczestnikami w czasie rzeczywistym
- **Organizatorzy spotkań firmowych** — anonimowe zbieranie feedbacku od pracowników
- **Wykładowcy akademiccy** — angażowanie studentów podczas zajęć

### Linki

- **Repozytorium:** [https://github.com/bsk03/live-feedback-wall](https://github.com/bsk03/live-feedback-wall)
- **Aplikacja live:** [https://live-feedback-wall.onrender.com/](https://live-feedback-wall.onrender.com/)

\newpage

## 4. Architektura

### Model architektoniczny

Aplikacja oparta jest na architekturze **klient-serwer** z komunikacją w czasie rzeczywistym. Wykorzystuje wzorzec **T3 Stack** (Next.js + tRPC + Drizzle + Tailwind) rozszerzony o warstwę WebSocket (Socket.IO).

### Warstwy systemu

| Warstwa                | Technologia                        | Odpowiedzialność                               |
| ---------------------- | ---------------------------------- | ---------------------------------------------- |
| Prezentacji (Frontend) | Next.js 15, React 18, Tailwind CSS | Interfejs użytkownika, routing, stan aplikacji |
| API (Backend)          | tRPC, Next.js API Routes           | Logika biznesowa, walidacja, autentykacja      |
| Komunikacji real-time  | Socket.IO                          | Dwukierunkowa komunikacja WebSocket            |
| Danych                 | PostgreSQL, Drizzle ORM            | Przechowywanie i zarządzanie danymi            |
| Autentykacji           | Better Auth                        | Zarządzanie sesjami, hashowanie haseł          |

### Diagram architektury

![Diagram architektury](images/architektura.png)

**Opis:** Diagram przedstawiający warstwy systemu i przepływ danych. Przeglądarka komunikuje się z serwerem Next.js poprzez HTTP (tRPC) dla operacji CRUD oraz przez WebSocket (Socket.IO) dla komunikacji real-time. Serwer łączy się z bazą PostgreSQL (Neon) przez Drizzle ORM. CI/CD realizowane przez GitHub Actions i Render.

\newpage

## 5. Wymagania

### a) Wymagania funkcjonalne

| ID    | Wymaganie                                                                     | Priorytet |
| ----- | ----------------------------------------------------------------------------- | --------- |
| WF-01 | System umożliwia rejestrację organizatora za pomocą adresu email i hasła      | Wysoki    |
| WF-02 | System umożliwia logowanie organizatora za pomocą adresu email i hasła        | Wysoki    |
| WF-03 | System umożliwia wylogowanie organizatora                                     | Wysoki    |
| WF-04 | Organizator może utworzyć nowy pokój z podaną nazwą                           | Wysoki    |
| WF-05 | System automatycznie generuje unikalny kod pokoju w formacie XXX-XXX          | Wysoki    |
| WF-06 | Organizator może przeglądać listę swoich pokoi                                | Wysoki    |
| WF-07 | Organizator może udostępnić kod pokoju oraz kod QR                            | Średni    |
| WF-08 | Uczestnik może dołączyć do pokoju za pomocą 6-znakowego kodu                  | Wysoki    |
| WF-09 | Uczestnik może wysyłać wiadomości tekstowe do pokoju                          | Wysoki    |
| WF-10 | Wiadomości wyświetlane są wszystkim użytkownikom pokoju w czasie rzeczywistym | Wysoki    |
| WF-11 | Organizator może przeglądać wiadomości w panelu administracyjnym              | Wysoki    |
| WF-12 | System obsługuje paginację wiadomości (infinite scroll)                       | Średni    |
| WF-13 | Użytkownik może przełączać motyw (ciemny/jasny)                               | Niski     |

### b) Wymagania niefunkcjonalne

| ID    | Wymaganie                                                                | Kategoria      |
| ----- | ------------------------------------------------------------------------ | -------------- |
| WN-01 | Czas dostarczenia wiadomości do pozostałych uczestników < 500ms          | Wydajność      |
| WN-02 | Interfejs dostosowuje się do urządzeń mobilnych i desktopowych           | Użyteczność    |
| WN-03 | Komunikacja odbywa się przez protokół HTTPS/WSS                          | Bezpieczeństwo |
| WN-04 | Hasła użytkowników są hashowane przed zapisem w bazie                    | Bezpieczeństwo |
| WN-05 | System ogranicza liczbę wiadomości do 30 na minutę per użytkownik        | Bezpieczeństwo |
| WN-06 | Aplikacja obsługuje nagłówki bezpieczeństwa (HSTS, X-Frame-Options, CSP) | Bezpieczeństwo |
| WN-07 | Walidacja danych wejściowych po stronie klienta i serwera (Zod)          | Bezpieczeństwo |
| WN-08 | System spełnia podstawowe wymagania WCAG 2.1 poziom AA                   | Dostępność     |
| WN-09 | Aplikacja dostępna 24/7 (hosting Render + UptimeRobot)                   | Dostępność     |
| WN-10 | System obsługuje język polski w interfejsie i komunikatach błędów        | Użyteczność    |

\newpage

## 6. Ograniczenia

### Ograniczenia sprzętowe

| Element                | Wymaganie minimalne                                                        |
| ---------------------- | -------------------------------------------------------------------------- |
| Urządzenie użytkownika | Dowolne urządzenie z przeglądarką internetową (komputer, tablet, smartfon) |
| Przeglądarka           | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+                              |
| Połączenie internetowe | Wymagane (WebSocket wymaga stałego połączenia)                             |
| Serwer (development)   | Node.js 20+, 512 MB RAM                                                    |
| Serwer (produkcja)     | Render Free Tier (512 MB RAM, shared CPU)                                  |

### Ograniczenia programowe

| Element                   | Szczegóły                                         |
| ------------------------- | ------------------------------------------------- |
| Środowisko uruchomieniowe | Node.js >= 20.0.0                                 |
| Baza danych               | PostgreSQL 14+                                    |
| System operacyjny serwera | Linux (Render), Windows/macOS/Linux (development) |
| Menedżer pakietów         | npm                                               |

### Ograniczenia projektowe

- Darmowy hosting Render — aplikacja może zostać uśpiona po 15 minutach nieaktywności (rozwiązanie: UptimeRobot)
- Darmowy tier Neon PostgreSQL — limit 0.5 GB storage
- Brak możliwości horyzontalnego skalowania Socket.IO bez Redis Adapter

\newpage

## 7. Użytkownicy (aktorzy / role / persony)

### Aktorzy systemowi

| Aktor           | Opis                                                                                                             | Autentykacja                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Organizator** | Zarejestrowany użytkownik, który tworzy pokoje, udostępnia kody dostępu, przegląda wiadomości i moderuje treści. | Wymagana (email + hasło)       |
| **Uczestnik**   | Anonimowy użytkownik, który dołącza do pokoju za pomocą kodu i wysyła wiadomości.                                | Brak (dostęp przez kod pokoju) |

### Persony

#### Persona 1: Organizator

| Cecha                 | Opis                                                                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Imię**              | Anna Nowak                                                                                                                                                                                                      |
| **Wiek**              | 34 lata                                                                                                                                                                                                         |
| **Rola**              | Trenerka prowadząca warsztaty UX Design                                                                                                                                                                         |
| **Cel**               | Chce zbierać na żywo opinie od 20-30 uczestników warsztatów, żeby dynamicznie dostosowywać tempo i treść zajęć.                                                                                                 |
| **Frustracje**        | Dotychczas używała karteczek samoprzylepnych — trudno je odczytać, łatwo zgubić, brak archiwizacji. Formularze online (Google Forms) wypełniane są po zajęciach, kiedy uczestnicy już nie pamiętają szczegółów. |
| **Scenariusz użycia** | Przed warsztatem Anna tworzy pokój w Live Feedback Wall, wyświetla QR code na projektorze. Uczestnicy skanują kod telefonem i wysyłają komentarze. Anna widzi je na panelu w czasie rzeczywistym.               |

#### Persona 2: Uczestnik

| Cecha                 | Opis                                                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Imię**              | Tomek Wiśniewski                                                                                                                                               |
| **Wiek**              | 22 lata                                                                                                                                                        |
| **Rola**              | Student informatyki na wykładzie                                                                                                                               |
| **Cel**               | Chce szybko zadać pytanie prowadzącemu bez przerywania wykładu i bez konieczności rejestracji.                                                                 |
| **Frustracje**        | Wstydzi się zadawać pytania na głos. Nie chce zakładać kolejnego konta w nowym serwisie.                                                                       |
| **Scenariusz użycia** | Tomek skanuje QR code wyświetlony na slajdzie, wpisuje 6-znakowy kod, pisze pytanie. Prowadzący widzi je na swoim panelu i odpowiada na nie w trakcie wykładu. |

\newpage
