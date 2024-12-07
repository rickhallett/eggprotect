import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const starState = await prisma.starState.findFirst()
  if (!starState) {
    // Create initial state if none exists
    const initialState = await prisma.starState.create({
      data: {
        id: '1',
        activeStars: 9
      }
    })
    return NextResponse.json(initialState)
  }
  return NextResponse.json(starState)
}

export async function POST(request: Request) {
  const { activeStars } = await request.json()
  const starState = await prisma.starState.upsert({
    where: { id: '1' },
    update: { activeStars },
    create: { id: '1', activeStars }
  })
  return NextResponse.json(starState)
}
