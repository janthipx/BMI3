'use client'

import { FormEvent, useState } from 'react'

export default function MonthlyReportPage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [year, setYear] = useState(String(currentYear))
  const [month, setMonth] = useState(String(currentMonth))
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
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">Monthly Report</h1>
        <p className="text-slate-500">Track monthly achievements and visualize long-term patterns.</p>
      </div>

      <div className="glass-card p-8 mb-8">
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-end" onSubmit={onSubmit}>
          <div>
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
          <div>
            <label htmlFor="month" className="block text-sm font-semibold text-slate-700 mb-2">Month</label>
            <select
              id="month"
              className="input-field w-full"
              value={month}
              onChange={e => setMonth(e.target.value)}
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary py-3 px-6 justify-center">
            Generate Report
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 animate-fade-in">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
           <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
             <p className="text-purple-800 font-medium text-lg">
               Report for: <span className="font-bold">{new Date(0, Number(result.month) - 1).toLocaleString('default', { month: 'long' })} {result.year}</span>
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Records</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{result.stats?.count ?? 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                 </svg>
               </div>
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Average BMI</p>
               <p className="text-4xl font-bold text-slate-900 mt-2">{result.stats?.avg_bmi ? Number(result.stats.avg_bmi).toFixed(1) : '-'}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

