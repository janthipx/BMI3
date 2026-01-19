import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

function getWeekRange(dateStr: string): { start: string; end: string } {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diffToMonday = (day + 6) % 7
  const start = new Date(d)
  start.setDate(d.getDate() - diffToMonday)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const toIsoDate = (dt: Date) => dt.toISOString().slice(0, 10)
  return { start: toIsoDate(start), end: toIsoDate(end) }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })

  const { start, end } = getWeekRange(date)
  const db = getDb()

  const stats = db
    .prepare(
      `
      SELECT COUNT(*) as count,
             AVG(bmi_value) as avg_bmi
      FROM BMI_Records
      WHERE user_id = ?
        AND date(record_date) BETWEEN date(?) AND date(?)
    `
    )
    .get(user.id, start, end)

  const daily = db
    .prepare(
      `
      SELECT date(record_date) as date,
             AVG(bmi_value) as avg_bmi,
             COUNT(*) as count
      FROM BMI_Records
      WHERE user_id = ?
        AND date(record_date) BETWEEN date(?) AND date(?)
      GROUP BY date(record_date)
      ORDER BY date(record_date)
    `
    )
    .all(user.id, start, end)

  return NextResponse.json({ range: { start, end }, stats, daily })
}

