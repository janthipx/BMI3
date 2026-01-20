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
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="glass-card w-full max-w-md p-8 shadow-2xl shadow-indigo-200/50 border border-white/50 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">Create Account</h1>
          <p className="text-slate-500">Join BMI Elite and start tracking today</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700">Display Name</label>
            <input
              id="displayName"
              className="input-field w-full"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              className="input-field w-full"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              className="input-field w-full"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="heightDefault" className="block text-sm font-semibold text-slate-700">Default Height (m) <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
            <input
              id="heightDefault"
              className="input-field w-full"
              type="number"
              step="0.01"
              value={heightDefault}
              onChange={e => setHeightDefault(e.target.value)}
              placeholder="1.75"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-lg shadow-lg shadow-indigo-200 mt-2">
            Create Account
          </button>

          <p className="text-center text-sm text-slate-500 pt-4">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}

