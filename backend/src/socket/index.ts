import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { env } from "../config/env";

let ioInstance: SocketIOServer | null = null;

export function initSocketIO(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL, "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    // Join room for specific listing or diagnostic updates
    socket.on("join_listing", (listingId: string) => {
      socket.join(`listing_${listingId}`);
      console.log(`⚡ [Socket.io] Client ${socket.id} joined room listing_${listingId}`);
    });

    // Real-time AI Diagnostic simulation / test ping
    socket.on("ping_diagnostic", (data: { deviceModel: string }) => {
      socket.emit("diagnostic_progress", {
        step: "AI Optical Analysis",
        progress: 45,
        timestamp: new Date().toISOString(),
        model: data.deviceModel,
      });
    });

    socket.on("disconnect", () => {
      console.log(`⚡ [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}
