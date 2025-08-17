import React, { useState } from "react";
import dynamic from "next/dynamic";
import { WebSocketMessage } from "../types";

const WalletConnect = dynamic(() => import("../components/WalletConnect"), {
  ssr: false,
});
const SignMessage = dynamic(() => import("../components/SignMessage"), {
  ssr: false,
});
const WebSocketListener = dynamic(
  () => import("../components/WebSocketListener"),
  { ssr: false }
);

export default function Home() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        fontFamily: "ui-sans-serif, system-ui",
      }}>
      <h1>Web3 Integration Test (Bugged)</h1>
      <p>Connect your wallet, sign messages, and watch WebSocket updates.</p>

      <section style={{ marginTop: 24 }}>
        <h2>1) Wallet Connection</h2>
        <WalletConnect />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>2) Sign Message</h2>
        <SignMessage message="Hello from BetterTherapy!" />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>3) WebSocket Listener</h2>
        <WebSocketListener
          url={process.env.NEXT_PUBLIC_WEBSOCKET_URL || ""}
          onMessage={(m) => setMessages((prev) => [...prev, m])}
        />
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 12,
            borderRadius: 8,
            marginTop: 12,
            maxHeight: 200,
            overflow: "auto",
          }}>
          {JSON.stringify(messages, null, 2)}
        </pre>
      </section>
    </main>
  );
}
