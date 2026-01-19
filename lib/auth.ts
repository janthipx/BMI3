import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

type JwtPayload = {
  sub: number
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createAuthToken(userId: number, email: string): string {
  const payload: JwtPayload = { sub: userId, email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload
    return decoded
  } catch {
    return null
  }
}

export async function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get('auth_token')
  if (!cookie?.value) return null

  const payload = verifyAuthToken(cookie.value)
  if (!payload) return null

  const db = getDb()
  const user = db
    .prepare(
      `
      SELECT id, email, display_name, height_default
      FROM Users
      WHERE id = ?
    `
    )
    .get(payload.sub) as { id: number; email: string; display_name: string; height_default: number | null } | undefined

  return user || null
}

