import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // Find a valid, unused code
    const otpCode = await prisma.oTPCode.findFirst({
      where: {
        code: code,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpCode) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 401 }
      );
    }

    // Mark the code as used
    await prisma.oTPCode.update({
      where: { id: otpCode.id },
      data: { used: true }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// Helper endpoint to generate codes (should be protected in production)
export async function GET() {
  try {
    const code = Math.random().toString().slice(2, 8);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const otpCode = await prisma.oTPCode.create({
      data: {
        code,
        expiresAt
      }
    });

    return NextResponse.json({ code: otpCode.code });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate code', message: (error as Error).message },
      { status: 500 }
    );
  }
}