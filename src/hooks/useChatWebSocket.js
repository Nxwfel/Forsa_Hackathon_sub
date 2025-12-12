// src/hooks/useChatWebSocket.js
import { useEffect, useRef, useState } from "react";

// You can change this later to your deployed backend WS URL
// For dev with backend on localhost:
const WS_BASE =
  import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

export default function useChatWebSocket(username, enabled) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // if chatbot is closed or no username → ensure socket is closed
    if (!enabled || !username) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    const url = `${WS_BASE}/ws/${encodeURIComponent(username)}`;
    console.log("[WS] Connecting to:", url);
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WS] connected");
      setConnected(true);
      setMessages((prev) => [
        ...prev,
        { from: "system", text: "Connecté au chatbot." },
      ]);
    };

    socket.onmessage = (event) => {
      console.log("[WS] message from backend:", event.data);
      setMessages((prev) => [
        ...prev,
        { from: "backend", text: event.data },
      ]);
    };

    socket.onclose = () => {
      console.log("[WS] closed");
      setConnected(false);
      setMessages((prev) => [
        ...prev,
        { from: "system", text: "Connexion fermée." },
      ]);
    };

    socket.onerror = (err) => {
      console.error("[WS] error:", err);
    };

    // cleanup
    return () => {
      console.log("[WS] cleanup - closing socket");
      socket.close();
    };
  }, [enabled, username]);

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[WS] cannot send, socket not open");
      return;
    }

    socketRef.current.send(text);
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const clearMessages = () => setMessages([]);

  return { messages, sendMessage, connected, clearMessages };
}
