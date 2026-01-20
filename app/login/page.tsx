'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Failed to login')
      return
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="glass-card w-full max-w-md p-8 shadow-2xl shadow-indigo-200/50 border border-white/50 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">Welcome healthy journey</h1>
          <p className="text-slate-500">Sign in to continue your healthy journey</p>
        </div>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              className="input-field w-full"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
              <a href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              className="input-field w-full"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-lg shadow-lg shadow-indigo-200">
            Sign In
          </button>

          <p className="text-center text-sm text-slate-500 pt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline">
              Create Account
            </a>
          <p className="mt-1 opacity-75 font-medium text-slate-700">Email Address: test@exemple.com</p>
          <p className="mt-1 opacity-75 font-medium text-slate-700">password: Test2006</p>
          </p>
        </form>
      </div>
    </main>
  )
}

