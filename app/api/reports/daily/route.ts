import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })

  const db = getDb()

  const stats = db
    .prepare(
      `
      SELECT COUNT(*) as count,
             AVG(bmi_value) as avg_bmi,
             MIN(bmi_value) as min_bmi,
             MAX(bmi_value) as max_bmi
      FROM BMI_Records
      WHERE user_id = ?
        AND date(record_date) = date(?)
    `
    )
    .get(user.id, date)

  const categories = db
    .prepare(
      `
      SELECT bmi_category, COUNT(*) as count
      FROM BMI_Records
      WHERE user_id = ?
        AND date(record_date) = date(?)
      GROUP BY bmi_category
    `
    )
    .all(user.id, date)

  return NextResponse.json({ date, stats, categories })
}

