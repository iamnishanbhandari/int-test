import { WebSocketServer } from 'ws';

const PORT = Number(process.env.WS_PORT || 4001);
const wss = new WebSocketServer({ port: PORT });

console.log(`WS server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'WALLET_UPDATE', payload: { connected: true, at: Date.now() } }));
  const id = setInterval(() => {
    ws.send(JSON.stringify({ type: 'TRANSACTION', payload: { hash: Math.random().toString(16).slice(2), at: Date.now() } }));
  }, 3000);
  ws.on('close', () => clearInterval(id));
});