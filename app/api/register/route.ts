import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { logInfo, logWarn } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName, heightDefault } = await req.json()

    if (!email || !password || !displayName) {
      logWarn('Register failed: missing fields', { email })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (existing) {
      logWarn('Register failed: email exists', { email })
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        heightDefault: heightDefault ?? null
      }
    })

    logInfo('Register success', { userId: user.id, email })

    return NextResponse.json(
      { id: user.id, email, displayName, heightDefault: heightDefault ?? null },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register API Error:', error)
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 })
  }
}