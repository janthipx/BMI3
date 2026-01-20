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
      
      setMessage('Profile updated successfully')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  )

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-serif mb-2">My Profile</h1>
          <p className="text-slate-500">Manage your account settings and preferences.</p>
        </div>
        <Link href="/dashboard" className="btn-secondary self-start">
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-card p-8 max-w-2xl mx-auto">
        <form className="space-y-6" onSubmit={onSubmit}>
          {message && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <input
                className="input-field w-full bg-slate-50 text-slate-500 cursor-not-allowed pl-10"
                value={email}
                disabled
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-400 ml-1">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700">Display Name</label>
            <input
              id="displayName"
              className="input-field w-full"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="heightDefault" className="block text-sm font-semibold text-slate-700">Default Height (m)</label>
            <input
              id="heightDefault"
              className="input-field w-full"
              type="number"
              step="0.01"
              placeholder="e.g. 1.75"
              value={heightDefault}
              onChange={e => setHeightDefault(e.target.value)}
            />
            <p className="text-xs text-slate-500 ml-1">This will be used as default for new BMI records.</p>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full justify-center py-3 text-lg shadow-lg shadow-indigo-200">
              Save Changes
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Actions</h3>
          <button 
             type="button"
             onClick={async () => {
               if (confirm('Are you sure you want to logout?')) {
                 await fetch('/api/logout', { method: 'POST' })
                 router.push('/login')
               }
             }}
             className="w-full py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
             </svg>
             Sign Out
           </button>
        </div>
      </div>
    </main>
  )
}
