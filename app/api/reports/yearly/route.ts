import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year')

  if (!year) {
    return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 })
  }

  const yearNum = parseInt(year)
  const startOfYear = new Date(yearNum, 0, 1)
  const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999)

  const records = await prisma.bmiRecord.findMany({
    where: {
      userId: user.id,
      recordDate: {
        gte: startOfYear,
        lte: endOfYear
      }
    },
    select: {
      recordDate: true,
      bmiValue: true
    }
  })

  const count = records.length
  const sum = records.reduce((acc: number, r: { bmiValue: number }) => acc + r.bmiValue, 0)
  const avg_bmi = count > 0 ? sum / count : null
  const stats = { count, avg_bmi }

  const monthlyMap = records.reduce((acc: Record<string, { sum: number; count: number }>, r: { recordDate: Date; bmiValue: number }) => {
    // Month is 0-indexed in JS Date, but we want 01-12 string
    const m = (r.recordDate.getMonth() + 1).toString().padStart(2, '0')
    if (!acc[m]) acc[m] = { sum: 0, count: 0 }
    acc[m].sum += r.bmiValue
    acc[m].count += 1
    return acc
  }, {} as Record<string, { sum: number; count: number }>)

  const monthly = (Object.entries(monthlyMap) as [string, { sum: number; count: number }][]).map(([m, val]) => ({
    month: m,
    avg_bmi: val.sum / val.count,
    count: val.count
  })).sort((a, b) => a.month.localeCompare(b.month))

  return NextResponse.json({ year, stats, monthly })
}

