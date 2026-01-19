'use client'

import { FormEvent, useState } from 'react'

export default function MonthlyReportPage() {
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    const params = new URLSearchParams({ year, month })
    const res = await fetch(`/api/reports/monthly?${params.toString()}`)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Cannot fetch monthly report')
      return
    }
    setResult(await res.json())
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Monthly Report</h1>
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <input
          className="border rounded px-2 py-1"
          type="number"
          placeholder="ปี เช่น 2026"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1"
          type="number"
          placeholder="เดือน 1-12"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
          View Report
        </button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p>
            Month: {result.year}-{result.month}
          </p>
          <p>Total Records: {result.stats?.count ?? 0}</p>
          <p>Average BMI: {result.stats?.avg_bmi ?? '-'}</p>
        </div>
      )}
    </main>
  )
}

