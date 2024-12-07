import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const starState = await prisma.starState.findFirst()
  return NextResponse.json(starState || { activeStars: 9 })
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
