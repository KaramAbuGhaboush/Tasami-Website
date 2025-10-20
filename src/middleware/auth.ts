import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/', '/about', '/services', '/work', '/contact', '/blog', '/career', '/projects', '/404'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side auth context handle the logic
  // This middleware just allows the request to pass through
  return NextResponse.next();
}

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
