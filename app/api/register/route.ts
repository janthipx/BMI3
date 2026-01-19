import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { logInfo, logWarn } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const { email, password, displayName, heightDefault } = await req.json()

  if (!email || !password || !displayName) {
    logWarn('Register failed: missing fields', { email })
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = getDb()
  const existing = db
    .prepare('SELECT id FROM Users WHERE email = ?')
    .get(email) as { id: number } | undefined

  if (existing) {
    logWarn('Register failed: email exists', { email })
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)

  const result = db
    .prepare(
      `
      INSERT INTO Users (email, password_hash, display_name, height_default)
      VALUES (?, ?, ?, ?)
    `
    )
    .run(email, passwordHash, displayName, heightDefault ?? null)

  logInfo('Register success', { userId: result.lastInsertRowid, email })

  return NextResponse.json(
    { id: result.lastInsertRowid, email, displayName, heightDefault: heightDefault ?? null },
    { status: 201 }
  )
}

