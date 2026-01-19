'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateBmi, categorizeBmi } from '@/lib/bmi'

export default function BmiNewPage() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

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
    <main className="p-4 flex justify-center">
      <form className="w-full max-w-md space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">save BMI</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-1">
          <label className="block text-sm">Date</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Weight (kg)</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Height (m)</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="number"
            step="0.01"
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Note</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        {/* Display Calculated BMI */}
        {(() => {
          const w = parseFloat(weight)
          const h = parseFloat(height)

          // Show warning if height seems to be in cm (e.g. > 3 meters)
          if (!isNaN(h) && h >= 3) {
            return (
              <div className="p-2 bg-yellow-50 text-yellow-700 text-sm rounded text-center">
                ⚠️ Please enter height in meters (e.g. 1.70)
              </div>
            )
          }

          // Only calculate if inputs are valid and reasonable
          if (!isNaN(w) && !isNaN(h) && h > 0 && h < 3 && w > 0) {
            try {
              const bmi = calculateBmi(w, h)
              if (bmi > 0) {
                const cat = categorizeBmi(bmi)
                return (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center">
                    <p className="font-semibold text-blue-800 text-lg">BMI: {bmi}</p>
                    <p className="text-blue-600">Category: {cat}</p>
                  </div>
                )
              }
            } catch { return null }
          }
          return null
        })()}

        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">
          Save
        </button>
      </form>
    </main>
  )
}

