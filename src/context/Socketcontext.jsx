// context/SocketProvider.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket instance only once
    if (!socketRef.current) {
      socketRef.current = io(
        process.env.REACT_APP_BACKEND_URL || "https://socket-server-sandbox.onrender.com",
        {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          autoConnect: true
        }
      );

      console.log("🔌 Socket instance created");
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("🟢 Socket Connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason) => {
      console.log("🔴 Socket Disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("❌ Socket Connection Error:", error.message);
      setIsConnected(false);
    };

    const handleReconnect = (attemptNumber) => {
      console.log(`🔄 Socket Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect", handleReconnect);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};