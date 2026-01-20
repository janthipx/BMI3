'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calculateBmi, categorizeBmi } from '@/lib/bmi'

export default function BmiNewPage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0])
  }, [])

  // Calculate preview
  const bmiValue = (weight && height) ? calculateBmi(Number(weight), Number(height)) : null
  const bmiCategory = bmiValue ? categorizeBmi(bmiValue) : null

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const res = await fetch('/api/bmi-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recordDate: date,
        weight: Number(weight),
        height: Number(height),
        note
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'save data failed')
      return
    }
    router.push('/bmi/history')
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 font-serif mb-3">New Measurement</h1>
        <p className="text-slate-500">Record your current metrics to track your health journey.</p>
      </div>

      <div className="glass-card p-8 md:p-10">
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              id="date"
              type="date"
              className="input-field w-full"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
              <div className="relative">
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  className="input-field w-full pr-12"
                  placeholder="0.0"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 sm:text-sm">kg</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-semibold text-slate-700 mb-2">Height (m)</label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  step="0.01"
                  className="input-field w-full pr-12"
                  placeholder="0.00"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 sm:text-sm">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live BMI Preview */}
          {(bmiValue !== null) && (
            <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">Estimated BMI</p>
                <p className="text-3xl font-bold text-slate-900 font-serif">{bmiValue.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  bmiCategory === 'Normal weight' ? 'bg-green-100 text-green-800' :
                  bmiCategory === 'Underweight' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {bmiCategory}
                </span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="note" className="block text-sm font-semibold text-slate-700 mb-2">Note (Optional)</label>
            <textarea
              id="note"
              className="input-field w-full h-24 resize-none"
              placeholder="How are you feeling today?"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

