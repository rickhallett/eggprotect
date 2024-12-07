import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stars = await prisma.star.findMany({
      orderBy: { position: 'asc' }
    })

    if (stars.length === 0) {
      // Create initial state if none exists
      const initialStars = await Promise.all(
        Array(9).fill(null).map((_, index) => {
          // Calculate time from now, with last star expiring first
          const timeUntilExpiry = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000") * (9 - index);
          return prisma.star.create({
            data: {
              position: index,
              active: true,
              expiresAt: new Date(Date.now() + timeUntilExpiry)
            }
          });
        })
      )
      return NextResponse.json(initialStars)
    }
    return NextResponse.json(stars)
  } catch (error) {
    console.error('Error in GET /api/stars:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { position, active, expiresAt } = await request.json()

  const star = await prisma.star.upsert({
    where: { position },
    update: {
      active,
      expiresAt: new Date(expiresAt)
    },
    create: {
      position,
      active,
      expiresAt: new Date(expiresAt)
    }
  })

  return NextResponse.json(star)
}

export async function PATCH(request: Request) {
  try {
    // Find all stars ordered by position
    const stars = await prisma.star.findMany({
      orderBy: { position: 'asc' }
    });

    // Find the position of the first inactive star
    const firstInactivePosition = stars.findIndex(star => !star.active);
    if (firstInactivePosition === -1) {
      return NextResponse.json({ message: "All stars are already active" }, { status: 400 });
    }

    // Refresh that star
    const timeUntilExpiry = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000");
    const star = await prisma.star.update({
      where: { position: firstInactivePosition },
      data: {
        active: true,
        expiresAt: new Date(Date.now() + timeUntilExpiry * (9 - firstInactivePosition))
      }
    });

    return NextResponse.json(star);
  } catch (error) {
    console.error('Error in PATCH /api/stars:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Reset all stars to active with staggered expiry times
    const stars = await Promise.all(
      Array(9).fill(null).map((_, index) => {
        const timeUntilExpiry = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000") * (9 - index);
        return prisma.star.upsert({
          where: { position: index },
          update: {
            active: true,
            expiresAt: new Date(Date.now() + timeUntilExpiry)
          },
          create: {
            position: index,
            active: true,
            expiresAt: new Date(Date.now() + timeUntilExpiry)
          }
        });
      })
    );
    return NextResponse.json(stars);
  } catch (error) {
    console.error('Error in PUT /api/stars:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
