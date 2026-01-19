'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [heightDefault, setHeightDefault] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        displayName,
        heightDefault: heightDefault ? Number(heightDefault) : null
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Cannot register user')
      return
    }
    router.push('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-1">
          <label className="block text-sm">Display Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          สมัครสมาชิก
        </button>
      </form>
    </main>
  )
}

