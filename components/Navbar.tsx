'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (isAuthPage) return null

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/dashboard" className="text-2xl font-serif font-bold text-slate-800 tracking-tight hover:text-indigo-600 transition-colors">
              BMI <span className="text-indigo-600">Elite</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
            <NavLink href="/bmi/new" active={pathname === '/bmi/new'}>Record BMI</NavLink>
            <NavLink href="/bmi/history" active={pathname === '/bmi/history'}>History</NavLink>
            <NavLink href="/reports" active={pathname === '/reports'}>Reports</NavLink>
          </div>

          <div className="flex items-center space-x-4">
             <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link 
      href={href}
      className={`text-sm font-medium transition-all duration-200 ${
        active 
          ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
          : 'text-slate-500 hover:text-slate-900 hover:pb-1'
      }`}
    >
      {children}
    </Link>
  )
}
