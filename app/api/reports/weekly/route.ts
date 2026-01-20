import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function getWeekRange(dateStr: string): { start: Date; end: Date; startStr: string; endStr: string } {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diffToMonday = (day + 6) % 7
  const start = new Date(d)
  start.setDate(d.getDate() - diffToMonday)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  const toIsoDate = (dt: Date) => dt.toISOString().slice(0, 10)
  return { start, end, startStr: toIsoDate(start), endStr: toIsoDate(end) }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })

  const { start, end, startStr, endStr } = getWeekRange(date)

  const records = await prisma.bmiRecord.findMany({
    where: {
      userId: user.id,
      recordDate: {
        gte: start,
        lte: end
      }
    },
    select: {
      recordDate: true,
      bmiValue: true
    },
    orderBy: { recordDate: 'asc' }
  })

  const count = records.length
  const sum = records.reduce((acc: number, r: { bmiValue: number }) => acc + r.bmiValue, 0)
  const avg_bmi = count > 0 ? sum / count : null
  
  const stats = { count, avg_bmi }

  // Group by date
  const dailyMap = records.reduce((acc: Record<string, { sum: number; count: number }>, r: { recordDate: Date; bmiValue: number }) => {
    const d = r.recordDate.toISOString().slice(0, 10)
    if (!acc[d]) acc[d] = { sum: 0, count: 0 }
    acc[d].sum += r.bmiValue
    acc[d].count += 1
    return acc
  }, {} as Record<string, { sum: number; count: number }>)

  const daily = (Object.entries(dailyMap) as [string, { sum: number; count: number }][]).map(([d, val]) => ({
    date: d,
    avg_bmi: val.sum / val.count,
    count: val.count
  })).sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json({ range: { start: startStr, end: endStr }, stats, daily })
}

