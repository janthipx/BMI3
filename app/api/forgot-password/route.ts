import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const db = getDb()
  const user = db
    .prepare('SELECT id FROM Users WHERE email = ?')
    .get(email) as { id: number } | undefined

  if (user) {
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString()

    db.prepare(
      `
      INSERT INTO PasswordResetTokens (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `
    ).run(token, user.id, expiresAt)

    const base = process.env.APP_BASE_URL || 'http://localhost:3000'
    const resetLink = `${base}/reset-password?token=${token}`

    console.log('Password reset link', email, resetLink)
  }

  return NextResponse.json({
    message: 'If this email is registered, we have sent a password reset link to it'
  })
}

