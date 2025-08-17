import type { NextRequest } from "next/server";
import { applyRateLimit } from "./utils/rateLimiter";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(req: NextRequest) {
  console.log("req limit exceed");
  const res = applyRateLimit(req);
  return res || (undefined as any);
}
