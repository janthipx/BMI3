'use client'

import { FormEvent, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Reset password failed')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!token) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        No token found for password reset. Please request a new link.
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Password Reset Successful</h1>
        <p className="text-slate-500">Redirecting to login page...</p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2">
          Return to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-card w-full max-w-md p-8 shadow-2xl shadow-indigo-200/50 border border-white/50 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">Set New Password</h1>
        <p className="text-slate-500">Enter your new password below</p>
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
          <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700">New Password</label>
          <input
            id="new-password"
            className="input-field w-full"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min. 6 characters"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700">Confirm New Password</label> 
          <input
            id="confirm-password"
            className="input-field w-full"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Re-enter password"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full justify-center py-3 text-lg shadow-lg shadow-indigo-200">
          Save New Password
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
