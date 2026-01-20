'use client'

import { FormEvent, useState } from 'react'

export default function YearlyReportPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(String(currentYear))
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    
    try {
      const res = await fetch(`/api/reports/yearly?year=${encodeURIComponent(year)}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch report')
      }
      setResult(await res.json())
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 font-serif mb-3">Yearly Report</h1>
        <p className="text-slate-500">Review your annual health journey and set new milestones.</p>
      </div>

      <div className="glass-card p-8 mb-8">
        <form className="flex flex-col md:flex-row items-end gap-6 max-w-xl mx-auto" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="year" className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
            <input
              id="year"
              className="input-field w-full"
              type="number"
              placeholder="e.g. 2026"
              value={year}
              onChange={e => setYear(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary py-3 px-8 justify-center w-full md:w-auto">
            Generate Report
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 text-center border-l-4 border-emerald-500">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Year</h3>
            <p className="text-3xl font-bold text-slate-900">{result.year}</p>
          </div>
          
          <div className="glass-card p-8 text-center border-l-4 border-blue-500">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Records</h3>
            <p className="text-3xl font-bold text-slate-900">{result.stats?.count ?? 0}</p>
          </div>

          <div className="glass-card p-8 text-center border-l-4 border-indigo-500 md:col-span-2">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Average BMI</h3>
            <p className="text-4xl font-bold text-indigo-600 font-serif">
              {result.stats?.avg_bmi ? Number(result.stats.avg_bmi).toFixed(2) : '-'}
            </p>
            {result.stats?.avg_bmi && (
               <p className="text-sm text-slate-400 mt-2">Annual Average</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

