import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log the path for debugging purposes
  console.log('Middleware executing for path:', request.nextUrl.pathname)

  // Example: Check if the user is accessing an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Here you would typically check for authentication
    // For now, we'll just log it and allow the request to continue
    console.log('Admin route accessed')

    // If you need to redirect, you can do it like this:
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Optional: Configure middleware to run only for specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}