import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_BASE } from "../services/api";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  notifications: any[];
  unreadCount: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  unreadCount: 0,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const s = io(SOCKET_BASE, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 2,
    });

    setSocket(s);

    if (user?.id) {
      s.on(`notification:new:${user.id}`, (notif: any) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
