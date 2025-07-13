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

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`user ${socket.id} joined room ${roomId}`);

      const inputObj = {
        0: {
          json: {
            roomId: 1,
            cursor: 0,
            perPage: 20,
          },
        },
      };

      const inputParam = encodeURIComponent(JSON.stringify(inputObj));
      const url = `http://localhost:3000/api/trpc/message.getMessages?batch=1&input=${inputParam}`;

      const messages = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("przed");
      const data = (await messages.json())[0].result.data.json;
      console.log(data);
      socket.to(roomId).emit("user-joined", {
        id: socket.id,
        messagesData: data,
      });
    });

    socket.on("message", ({ roomId, message, sender }) => {
      console.log(`message from ${sender} in room ${roomId}: ${message}`);
      socket.to(roomId).emit("message", { message });
    });

    socket.on("disconnect", () => {
      console.log(`a user ${socket.id} disconnected`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
