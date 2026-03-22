# Live Feedback Wall

Interaktywna aplikacja webowa do zbierania opinii w czasie rzeczywistym podczas prezentacji, warsztatów i spotkań. Organizator tworzy pokój, udostępnia kod lub QR uczestnikom, a ci wysyłają wiadomości wyświetlane na żywo.

## Stos technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, tRPC, Socket.IO |
| Baza danych | PostgreSQL, Drizzle ORM |
| Autentykacja | Better Auth (email + hasło) |
| State management | Zustand, React Query |
| CI/CD | GitHub Actions, Render |

## Wymagania

- Node.js >= 20
- PostgreSQL 14+ (lub Docker)
- npm

## Instalacja i uruchomienie (środowisko lokalne)

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/bsk03/live-feedback-wall.git
cd live-feedback-wall
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

Skopiuj plik `.env.example` i uzupełnij wartości:

```bash
cp .env.example .env
```

Wymagane zmienne:

| Zmienna | Opis | Przykład |
|---------|------|----------|
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://postgres:password@localhost:5432/live-feedback-wall` |
| `BETTER_AUTH_SECRET` | Sekret do podpisywania sesji | Losowy string (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | URL aplikacji | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Publiczny URL aplikacji | `http://localhost:3000` |

### 4. Uruchomienie bazy danych

Przez Docker:

```bash
docker compose up -d
```

Lub użyj istniejącego PostgreSQL (np. Neon).

### 5. Migracja bazy danych

```bash
npx drizzle-kit push
```

### 6. Uruchomienie serwera deweloperskiego

```bash
npm run dev
```

Aplikacja dostępna pod `http://localhost:3000`.

## Uruchomienie w środowisku produkcyjnym

```bash
npm run build
node server.js
```

Aplikacja używa custom servera Node.js (Socket.IO wymaga trwałego połączenia WebSocket), dlatego nie można użyć `next start`.

### Deploy na Render

1. Utwórz Web Service i podepnij repozytorium
2. Build Command: `npm install --include=dev && npm run build`
3. Start Command: `node server.js`
4. Dodaj zmienne środowiskowe (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `NODE_ENV=production`)

## Skrypty

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Serwer deweloperski |
| `npm run build` | Build produkcyjny + migracja bazy |
| `npm test` | Testy jednostkowe (Vitest) |
| `npm run lint` | Sprawdzenie ESLint |
| `npm run typecheck` | Sprawdzenie typów TypeScript |
| `npm run db:push` | Push schematu do bazy |
| `npm run db:studio` | Drizzle Studio (przeglądarka bazy) |

## Struktura projektu

```
src/
  app/                  # Strony Next.js (App Router)
    (auth-routes)/      # Strony chronione (panel organizatora)
    api/                # Endpointy API (tRPC, auth)
    rooms/              # Strony pokoi (dołączanie, czat)
  components/           # Komponenty React
    auth/               # Logowanie i rejestracja
    landing/            # Strona główna
    panel/              # Panel organizatora
    rooms/              # Widok pokoju i czat
    ui/                 # Komponenty UI (shadcn/ui)
  server/
    api/routers/        # Routery tRPC (room, message, user)
    db/schema/          # Schemat bazy danych (Drizzle)
  hooks/                # Custom hooks (useSocketRoom, useInfiniteScroll)
  utils/                # Funkcje pomocnicze
  store/                # Zustand store
server.js               # Serwer HTTP + Socket.IO
```

## Testy

```bash
npm test
```

Projekt zawiera testy jednostkowe w Vitest obejmujące:
- Walidację formularzy (email, hasło, rejestracja)
- Generowanie kodów pokoi
- Tłumaczenie kodów błędów

## Licencja

MIT
