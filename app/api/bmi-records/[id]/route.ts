import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { logInfo, logWarn } from '@/lib/logger'

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

  const db = getDb()

  // Verify ownership
  const record = db.prepare('SELECT user_id FROM BMI_Records WHERE id = ?').get(id) as { user_id: number } | undefined

  if (!record) {
     return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  if (record.user_id !== user.id) {
    logWarn('Delete BMI unauthorized attempt', { userId: user.id, recordId: id })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  db.prepare('DELETE FROM BMI_Records WHERE id = ?').run(id)
  
  logInfo('BMI Record deleted', { userId: user.id, recordId: id })

  return NextResponse.json({ success: true })
}
