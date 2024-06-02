import { useEffect, useRef } from "react";

type MessageHandler = (data: any) => void;

const useWebSocket = (url: string, onMessage: MessageHandler) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket:", url);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket:", url);
    };

    return () => {
      ws.current?.close();
    };
  }, [url, onMessage]);

  return ws.current;
};

export default useWebSocket;
