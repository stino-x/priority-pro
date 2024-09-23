import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from "next/headers";

// Dummy function to check if a user is authenticated
// Replace this with your actual authentication check logic
const isAuthenticated = (request: NextRequest) => {
  // Example: Check for a session token or user information in cookies
  const token = cookies().get("appwrite-session");
  return !!token; // Return true if the token exists
};

export function middleware(request: NextRequest) {
  // Log the path for debugging purposes
  console.log('Middleware executing for path:', request.nextUrl.pathname);

  // Check if the user is authenticated
  if (!isAuthenticated(request)) {
    console.log('User not authenticated. Redirecting to login.');
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure middleware to run only for specific paths
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
};
