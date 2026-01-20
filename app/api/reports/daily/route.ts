import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  if (!dateStr) return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })

  const startOfDay = new Date(dateStr)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(dateStr)
  endOfDay.setHours(23, 59, 59, 999)

  const statsAgg = await prisma.bmiRecord.aggregate({
    where: {
      userId: user.id,
      recordDate: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    _count: { _all: true },
    _avg: { bmiValue: true },
    _min: { bmiValue: true },
    _max: { bmiValue: true }
  })

  const categoriesGroup = await prisma.bmiRecord.groupBy({
    by: ['bmiCategory'],
    where: {
      userId: user.id,
      recordDate: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    _count: { _all: true }
  })

  const stats = {
    count: statsAgg._count._all,
    avg_bmi: statsAgg._avg.bmiValue,
    min_bmi: statsAgg._min.bmiValue,
    max_bmi: statsAgg._max.bmiValue
  }

  const categories = categoriesGroup.map((g: any) => ({
    bmi_category: g.bmiCategory,
    count: g._count._all
  }))

  return NextResponse.json({ date: dateStr, stats, categories })
}

