import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { logInfo } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json()

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!record || record.used) {
    return NextResponse.json({ error: 'Invalid or used token' }, { status: 400 })
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 400 })
  }

  const passwordHash = await hashPassword(password)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { token },
      data: { used: true }
    })
  ])

  logInfo('Password reset success', { userId: record.userId })

  return NextResponse.json({ success: true })
}

