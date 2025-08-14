"use client";
import React, { useEffect, useRef, useState } from "react";
import type { WebSocketMessage } from "../types";

/**

 * @param {string} url 
 */
const WebSocketListener: React.FC<{
  url: string;
  onMessage?: (m: WebSocketMessage) => void;
}> = ({ url, onMessage }) => {
  const [status, setStatus] = useState<
    "DISCONNECTED" | "CONNECTING" | "CONNECTED"
  >("DISCONNECTED");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;
    setStatus("CONNECTING");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus("CONNECTED");
    ws.onclose = () => setStatus("DISCONNECTED");
    ws.onerror = () => setStatus("DISCONNECTED");
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage?.(data);
      } catch {}
    };

    return () => {
      ws.close();
    };
  }, [url, status]);

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
      <div>
        <b>WebSocket:</b> {status}
      </div>
    </div>
  );
};

export default WebSocketListener;
