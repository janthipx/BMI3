'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [heightDefault, setHeightDefault] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(res => {
        if (res.status === 401) {
          router.push('/login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(data => {
        setEmail(data.email)
        setDisplayName(data.displayName)
        setHeightDefault(data.heightDefault || '')
        setLoading(false)
      })
      .catch(() => {})
  }, [router])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          heightDefault: heightDefault ? Number(heightDefault) : null
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Cannot update profile')
      }
      
      setMessage('Update profile successfully')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <main className="p-4 max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <form className="space-y-4 border p-4 rounded bg-white shadow-sm" onSubmit={onSubmit}>
        {message && <div className="p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="space-y-1">
          <label className="block text-sm text-gray-600">Email (Cannot be changed)</label>
          <input
            className="w-full border rounded px-2 py-1 bg-gray-100"
            value={email}
            disabled
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Display Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Default Height (m)</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="number"
            step="0.01"
            value={heightDefault}
            onChange={e => setHeightDefault(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">
          Save Changes
        </button>
      </form>
      
      <div className="pt-4 border-t">
         <button 
           type="button"
           onClick={async () => {
             await fetch('/api/logout', { method: 'POST' })
             router.push('/login')
           }}
           className="text-red-600 hover:underline text-sm"
         >
           Logout
         </button>
      </div>
    </main>
  )
}
