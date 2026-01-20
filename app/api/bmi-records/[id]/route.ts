import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { logInfo, logWarn } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  const recordId = parseInt(id)
  if (isNaN(recordId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  // Verify ownership
  const record = await prisma.bmiRecord.findUnique({
    where: { id: recordId },
    select: { userId: true }
  })

  if (!record) {
     return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  if (record.userId !== user.id) {
    logWarn('Delete BMI unauthorized attempt', { userId: user.id, recordId: id })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.bmiRecord.delete({
    where: { id: recordId }
  })
  
  logInfo('BMI Record deleted', { userId: user.id, recordId: id })

  return NextResponse.json({ success: true })
}
