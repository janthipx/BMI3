import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!year || !month) {
    return NextResponse.json({ error: 'Year and month parameters are required' }, { status: 400 })
  }

  const monthStr = month.padStart(2, '0')
  const db = getDb()

  const stats = db
    .prepare(
      `
      SELECT COUNT(*) as count,
             AVG(bmi_value) as avg_bmi
      FROM BMI_Records
      WHERE user_id = ?
        AND strftime('%Y', record_date) = ?
        AND strftime('%m', record_date) = ?
    `
    )
    .get(user.id, year, monthStr)

  const daily = db
    .prepare(
      `
      SELECT date(record_date) as date,
             AVG(bmi_value) as avg_bmi,
             COUNT(*) as count
      FROM BMI_Records
      WHERE user_id = ?
        AND strftime('%Y', record_date) = ?
        AND strftime('%m', record_date) = ?
      GROUP BY date(record_date)
      ORDER BY date(record_date)
    `
    )
    .all(user.id, year, monthStr)

  return NextResponse.json({ year, month: monthStr, stats, daily })
}

