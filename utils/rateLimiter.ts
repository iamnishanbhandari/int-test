import type { NextRequest } from 'next/server';

type Store = { count: number; resetAt: number };
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQ = Number(process.env.NEXT_PUBLIC_RATE_LIMIT || '100');

const bucket = new Map<string, Store>();

export function applyRateLimit(req: NextRequest) {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const key = `ip:${ip}`;
  let store = bucket.get(key);
  if (!store || now >= store.resetAt) {
    store = { count: 0, resetAt: now + WINDOW_MS };
    bucket.set(key, store);
  }
  store.count += 1;

  if (store.count > MAX_REQ) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
}