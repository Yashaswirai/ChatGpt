import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

// Simple socket hook that connects with cookie auth and exposes send/receive helpers
export default function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Create once
  const socket = useMemo(() => {
    const s = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
    });
    socketRef.current = s;
    return s;
  }, []);

  useEffect(() => {
    socket.connect();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  return { socket, connected };
}
