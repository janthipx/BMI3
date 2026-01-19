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
    return <div className="text-red-600">No token found for password reset</div>
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-green-600">Password reset successful</h1>
        <p>Redirecting to login page...</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Click here if the page does not redirect automatically
        </Link>
      </div>
    )
  }

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold text-center">Set New Password</h1>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="space-y-1">
        <label className="block text-sm">New Password</label>
        <input
          className="w-full border rounded px-2 py-1"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm">Confirm New Password</label> 
        <input
          className="w-full border rounded px-2 py-1"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">
        Save new password
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
