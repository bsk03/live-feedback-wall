import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${port}`;
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

// Proste ograniczenie liczby zdarzeń per socket (rate limiting)
const MESSAGE_LIMIT = 30; // max wiadomości
const MESSAGE_WINDOW_MS = 60_000; // w ciągu 60 sekund
const messageCounts = new Map();

function isRateLimited(socketId) {
  const now = Date.now();
  const entry = messageCounts.get(socketId);
  if (!entry || now - entry.windowStart > MESSAGE_WINDOW_MS) {
    messageCounts.set(socketId, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > MESSAGE_LIMIT) {
    return true;
  }
  return false;
}

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: siteUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Ograniczenie rozmiaru wiadomości (1 KB)
    maxHttpBufferSize: 1024,
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("join-room", async (roomId) => {
      // Walidacja roomId - musi być stringiem niepustym
      if (typeof roomId !== "string" || roomId.trim().length === 0) {
        socket.emit("error", { message: "Nieprawidłowy identyfikator pokoju" });
        return;
      }

      socket.join(roomId);

      socket.to(roomId).emit("user-joined", {
        id: socket.id,
      });
    });

    socket.on("message", (data) => {
      // Walidacja danych wejściowych
      if (
        !data ||
        typeof data.roomId !== "string" ||
        typeof data.message !== "object"
      ) {
        socket.emit("error", { message: "Nieprawidłowy format wiadomości" });
        return;
      }

      // Rate limiting
      if (isRateLimited(socket.id)) {
        socket.emit("error", {
          message: "Zbyt wiele wiadomości. Spróbuj ponownie za chwilę.",
        });
        return;
      }

      // Sprawdzenie czy socket jest w pokoju
      if (!socket.rooms.has(data.roomId)) {
        socket.emit("error", { message: "Nie jesteś w tym pokoju" });
        return;
      }

      io.to(data.roomId).emit("message", {
        message: data.message,
      });
    });

    socket.on("disconnect", () => {
      // Czyszczenie rate limiter
      messageCounts.delete(socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
