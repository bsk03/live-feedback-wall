import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User ${socket.id} connected`);

    socket.on("join-room", async (roomId) => {
      console.log(`🚪 User ${socket.id} trying to join room ${roomId}`);

      socket.join(roomId);
      console.log(`✅ User ${socket.id} joined room ${roomId}`);

      // Sprawdź ile osób jest w pokoju
      const room = io.sockets.adapter.rooms.get(roomId);
      console.log(`👥 Room ${roomId} has ${room?.size || 0} users`);

      // Powiadom innych o dołączeniu
      socket.to(roomId).emit("user-joined", {
        id: socket.id,
      });

      console.log(
        `📢 Sent user-joined event for ${socket.id} to room ${roomId}`,
      );
    });

    socket.on("message", (data) => {
      console.log(`💬 Message received:`, JSON.stringify(data, null, 2));
      console.log(`📤 Sending message to room ${data.roomId}`);

      // Sprawdź ile osób jest w pokoju
      const room = io.sockets.adapter.rooms.get(data.roomId);
      console.log(`👥 Room ${data.roomId} has ${room?.size || 0} users`);

      // WAŻNE: Używamy io.to() żeby wysłać do WSZYSTKICH w pokoju
      io.to(data.roomId).emit("message", {
        message: data.message,
      });

      console.log(`✅ Message sent to all users in room ${data.roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User ${socket.id} disconnected`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server is running on http://${hostname}:${port}`);
  });
});
