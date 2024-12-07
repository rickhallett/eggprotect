import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const starState = await prisma.starState.findFirst({
      select: {
        id: true,
        activeStars: true,
        updatedAt: true
      }
    })
    
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
  } catch (error) {
    console.error('Error in GET /api/stars:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
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
