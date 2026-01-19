'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }
      
      setMessage(data.message)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>
        
        {message && <div className="p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded px-2 py-1"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">
          Send Reset Link
        </button>
        
        <div className="text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </main>
  )
}
