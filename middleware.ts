import type { NextRequest } from 'next/server';
import { applyRateLimit } from './utils/rateLimiter';

export const config = {
  matcher: '/:path*' 
};

export default function middleware(req: NextRequest) {
  const res = applyRateLimit(req);
  return res || undefined as any;
}
