import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { checkRateLimit, getClientIp, loginRateLimit } from '@/lib/rate-limit';
import { loginSchema, formatZodError } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    // Rate limiting - prevent brute force attacks
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`login:${clientIp}`, loginRateLimit);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Твърде много опити за вход. Опитайте отново след няколко минути.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      // Use same error message to prevent email enumeration
      return NextResponse.json(
        { error: 'Грешен имейл или парола' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Грешен имейл или парола' },
        { status: 401 }
      );
    }

    const token = await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Грешка при вход' },
      { status: 500 }
    );
  }
}
