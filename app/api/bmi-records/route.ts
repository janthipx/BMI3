import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { calculateBmi, categorizeBmi } from '@/lib/bmi'
import { logInfo } from '@/lib/logger'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: any = {
    userId: user.id
  }

  if (from) {
    where.recordDate = { ...where.recordDate, gte: new Date(from) }
  }
  if (to) {
    // Add one day to include the end date fully
    const toDate = new Date(to)
    toDate.setDate(toDate.getDate() + 1)
    where.recordDate = { ...where.recordDate, lt: toDate }
  }

  const records = await prisma.bmiRecord.findMany({
    where,
    orderBy: { recordDate: 'desc' },
    select: {
      id: true,
      recordDate: true,
      weight: true,
      height: true,
      bmiValue: true,
      bmiCategory: true,
      note: true
    }
  })

  // Map to snake_case to match original SQL output
  const rows = records.map((r: any) => ({
    id: r.id,
    record_date: r.recordDate.toISOString(), // SQLite date() might return string, Prisma returns Date
    weight: r.weight,
    height: r.height,
    bmi_value: r.bmiValue,
    bmi_category: r.bmiCategory,
    note: r.note
  }))

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { recordDate, weight, height, note } = await req.json()

  if (!recordDate || !weight || !height) {
    return NextResponse.json({ error: 'Missing required fields ' }, { status: 400 })
  }

  const weightNum = Number(weight)
  const heightNum = Number(height)

  if (weightNum <= 0 || heightNum <= 0) {
    return NextResponse.json({ error: 'Weight and height must be positive numbers' }, { status: 400 })
  }

  const bmi = calculateBmi(weightNum, heightNum)
  const category = categorizeBmi(bmi)

  const record = await prisma.bmiRecord.create({
    data: {
      userId: user.id,
      recordDate: new Date(recordDate),
      weight: weightNum,
      height: heightNum,
      bmiValue: bmi,
      bmiCategory: category,
      note: note ?? null
    }
  })

  logInfo('BMI Record created', { userId: user.id, bmi, category })

  return NextResponse.json(
    {
      id: record.id,
      recordDate,
      weight: weightNum,
      height: heightNum,
      bmiValue: bmi,
      bmiCategory: category,
      note: note ?? null
    },
    { status: 201 }
  )
}
