import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const latestRecord = await prisma.bmiRecord.findFirst({
    where: { userId: user.id },
    orderBy: { recordDate: 'desc' },
    select: {
      recordDate: true,
      weight: true,
      height: true,
      bmiValue: true,
      bmiCategory: true
    }
  })

  const stats = await prisma.bmiRecord.aggregate({
    where: { userId: user.id },
    _count: { _all: true },
    _avg: { bmiValue: true }
  })

  return NextResponse.json({
    latest: latestRecord
      ? {
          record_date: latestRecord.recordDate.toISOString(),
          weight: latestRecord.weight,
          height: latestRecord.height,
          bmi_value: latestRecord.bmiValue,
          bmi_category: latestRecord.bmiCategory
        }
      : null,
    summary: {
      count: stats._count._all,
      avg_bmi: stats._avg.bmiValue || null
    }
  })
}

