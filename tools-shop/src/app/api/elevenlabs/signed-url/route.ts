import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, elevenLabsRateLimit } from "@/lib/rate-limit";

// Agent ID in env var — keeps it out of source code
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID || "agent_0701khxj4n4herstwkr9dmjnhdrj";

export async function GET(request: NextRequest) {
  // Rate limiting — prevent API cost abuse
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`elevenlabs:${clientIp}`, elevenLabsRateLimit);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": apiKey } }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ signedUrl: data.signed_url });
}
