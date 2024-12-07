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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'gen') {
      // Generate new code
      const code = Math.random().toString().slice(2, 8);
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

      const otpCode = await prisma.oTPCode.create({
        data: {
          code,
          expiresAt
        }
      });

      return NextResponse.json({ code: otpCode.code });

    } else if (action === 'list') {
      // List all valid codes
      const validCodes = await prisma.oTPCode.findMany({
        where: {
          used: false,
          expiresAt: {
            gt: new Date()
          }
        },
        select: {
          code: true,
          expiresAt: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ codes: validCodes });

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}
