import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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

  const yearNum = parseInt(year)
  const monthNum = parseInt(month)
  const monthStr = month.padStart(2, '0')

  const startOfMonth = new Date(yearNum, monthNum - 1, 1)
  const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999)

  const records = await prisma.bmiRecord.findMany({
    where: {
      userId: user.id,
      recordDate: {
        gte: startOfMonth,
        lte: endOfMonth
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

  return NextResponse.json({ year, month: monthStr, stats, daily })
}