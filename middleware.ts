import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check for protected routes (admin and employee)
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee')) {
    // Check for auth cookie
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      // Redirect to 404 page to show custom 404
      return NextResponse.redirect(new URL('/404', request.url));
    }
    
    // Verify token
    const user = await verifyToken(authToken);
    if (!user) {
      // Invalid token, redirect to 404
      return NextResponse.redirect(new URL('/404', request.url));
    }
    
    // Check role for employee routes
    if (pathname.startsWith('/employee') && user.role !== 'employee') {
      return NextResponse.redirect(new URL('/404', request.url));
    }
    
    // Check role for admin routes
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/404', request.url));
    }
    
    // Valid authentication, allow through
    return NextResponse.next();
  }
  
  // Exclude login path from internationalization
  // Login path should work without locale prefixes
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }
  
  // Exclude static asset paths (fonts, images, etc.)
  if (pathname.startsWith('/Font') || 
      pathname.startsWith('/fonts') || 
      pathname.startsWith('/images') || 
      pathname.startsWith('/_next') ||
      pathname.match(/\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif|ico|webp)$/i)) {
    return NextResponse.next();
  }
  
  // Apply next-intl middleware for all other paths
  return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // - … static assets like fonts, images
    // Note: login, admin, and employee paths are matched but handled separately in the middleware function
    matcher: [
        '/',
        '/((?!api|_next|_vercel|Font|fonts|images|.*\\..*).*)'
    ]
};

