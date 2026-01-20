import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createAuthToken } from '@/lib/auth'
import { logInfo, logWarn } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    logWarn('Login failed: user not found', { email })
    return NextResponse.json({ error: 'Email or password is incorrect' }, { status: 401 })
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    logWarn('Login failed: wrong password', { email })
    return NextResponse.json({ error: 'Email or password is incorrect' }, { status: 401 })
  }

  const token = createAuthToken(user.id, user.email)
  logInfo('Login success', { userId: user.id, email: user.email })
  const res = NextResponse.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    heightDefault: user.heightDefault
  })

  res.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })

  return res
}

