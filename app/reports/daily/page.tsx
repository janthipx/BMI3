'use client'

import { FormEvent, useState } from 'react'

export default function DailyReportPage() {
  const [date, setDate] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    const res = await fetch(`/api/reports/daily?date=${encodeURIComponent(date)}`)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Cannot fetch daily report')
      return
    }
    setResult(await res.json())
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Daily Report</h1>
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <input
          className="border rounded px-2 py-1"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
          View Report
        </button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p>Total Records: {result.stats?.count ?? 0}</p>
          <p>Average BMI: {result.stats?.avg_bmi ?? '-'}</p>
        </div>
      )}
    </main>
  )
}

