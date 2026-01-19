import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { logInfo } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json()

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }

  const db = getDb()
  const record = db
    .prepare(
      `
      SELECT token, user_id, expires_at, used
      FROM PasswordResetTokens
      WHERE token = ?
    `
    )
    .get(token) as { token: string; user_id: number; expires_at: string; used: number } | undefined

  if (!record || record.used) {
    return NextResponse.json({ error: 'Invalid or used token' }, { status: 400 })
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 400 })
  }

  const passwordHash = await hashPassword(password)

  db.prepare(
    `
    UPDATE Users
    SET password_hash = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(passwordHash, record.user_id)

  db.prepare(
    `
    UPDATE PasswordResetTokens
    SET used = 1
    WHERE token = ?
  `
  ).run(token)

  logInfo('Password reset success', { userId: record.user_id })

  return NextResponse.json({ success: true })
}

