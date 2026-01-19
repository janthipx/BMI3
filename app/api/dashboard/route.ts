import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  const latest = db
    .prepare(
      `
      SELECT record_date, weight, height, bmi_value, bmi_category
      FROM BMI_Records
      WHERE user_id = ?
      ORDER BY record_date DESC
      LIMIT 1
    `
    )
    .get(user.id)

  const summary = db
    .prepare(
      `
      SELECT COUNT(*) as count,
             AVG(bmi_value) as avg_bmi
      FROM BMI_Records
      WHERE user_id = ?
    `
    )
    .get(user.id) as { count: number; avg_bmi: number | null }

  return NextResponse.json({
    latest,
    summary
  })
}

