import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/bmi', '/reports', '/profile']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected) {
    const token = request.cookies.get('auth_token')
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/bmi/:path*', '/reports/:path*', '/profile/:path*'],
}
