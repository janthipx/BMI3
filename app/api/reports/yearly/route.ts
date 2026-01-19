import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year')

  if (!year) {
    return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 })
  }

  const db = getDb()

  const stats = db
    .prepare(
      `
      SELECT COUNT(*) as count,
             AVG(bmi_value) as avg_bmi
      FROM BMI_Records
      WHERE user_id = ?
        AND strftime('%Y', record_date) = ?
    `
    )
    .get(user.id, year)

  const monthly = db
    .prepare(
      `
      SELECT strftime('%m', record_date) as month,
             AVG(bmi_value) as avg_bmi,
             COUNT(*) as count
      FROM BMI_Records
      WHERE user_id = ?
        AND strftime('%Y', record_date) = ?
      GROUP BY strftime('%m', record_date)
      ORDER BY month
    `
    )
    .all(user.id, year)

  return NextResponse.json({ year, stats, monthly })
}

