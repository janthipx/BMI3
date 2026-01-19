'use client'

import { FormEvent, useState } from 'react'

export default function YearlyReportPage() {
  const [year, setYear] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    const res = await fetch(`/api/reports/yearly?year=${encodeURIComponent(year)}`)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'ดึงรายงานไม่สำเร็จ')
      return
    }
    setResult(await res.json())
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">รายงานรายปี</h1>
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <input
          className="border rounded px-2 py-1"
          type="number"
          placeholder="ปี เช่น 2026"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
          ดูรายงาน
        </button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p>ปี: {result.year}</p>
          <p>จำนวนรายการ: {result.stats?.count ?? 0}</p>
          <p>BMI เฉลี่ย: {result.stats?.avg_bmi ?? '-'}</p>
        </div>
      )}
    </main>
  )
}

