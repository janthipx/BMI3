import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    heightDefault: user.heightDefault
  })
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { displayName, heightDefault } = await req.json()

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: displayName ?? undefined,
      heightDefault: heightDefault ?? undefined
    }
  })

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    heightDefault: updated.heightDefault
  })
}

