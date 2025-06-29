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
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`a user ${socket.id} connected`);

    socket.on("join-room", async (roomId: string) => {
      socket.join(roomId);
      console.log(`user ${socket.id} joined room ${roomId}`);
      const messages = await fetch(
        `http://localhost:3000/api/trpc/message.getMessages?input=${JSON.stringify({ roomId: parseInt(roomId) })}`,
      ).then((res) => res.json());
      console.log("messages trpc", messages.data);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on(
      "message",
      ({
        roomId,
        message,
        sender,
      }: {
        roomId: string;
        message: string;
        sender: string;
      }) => {
        console.log(`message from ${sender} in room ${roomId}: ${message}`);
        socket.to(roomId).emit("message", { message });
      },
    );

    socket.on("disconnect", () => {
      console.log(`a user ${socket.id} disconnected`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
