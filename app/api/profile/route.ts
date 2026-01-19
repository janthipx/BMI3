import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    heightDefault: user.height_default
  })
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { displayName, heightDefault } = await req.json()

  const db = getDb()
  db.prepare(
    `
    UPDATE Users
    SET display_name = COALESCE(?, display_name),
        height_default = COALESCE(?, height_default),
        updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(displayName ?? null, heightDefault ?? null, user.id)

  const updated = db
    .prepare(
      `
      SELECT id, email, display_name, height_default
      FROM Users
      WHERE id = ?
    `
    )
    .get(user.id) as { id: number; email: string; display_name: string; height_default: number | null }

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    displayName: updated.display_name,
    heightDefault: updated.height_default
  })
}

