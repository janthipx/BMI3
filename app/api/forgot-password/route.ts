import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })

  if (user) {
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    const base = process.env.APP_BASE_URL || 'http://localhost:3000'
    const resetLink = `${base}/reset-password?token=${token}`

    console.log('Password reset link', email, resetLink)
  }

  return NextResponse.json({
    message: 'If this email is registered, we have sent a password reset link to it'
  })
}

