import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Get admin secret path from environment
  const adminSecretPath = process.env.ADMIN_SECRET_PATH || 'admin-secret-dashboard-2024'
  
  // Block access to default admin paths if they don't match the secret path
  if (pathname.startsWith('/admin') && !pathname.startsWith(`/${adminSecretPath}`)) {
    // Redirect to 404 or home page to hide admin existence
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow access to the correct admin path
  if (pathname.startsWith(`/${adminSecretPath}`)) {
    // Rewrite to the actual admin page
    return NextResponse.rewrite(new URL('/admin', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-secret-dashboard-2024/:path*'
  ]
}
