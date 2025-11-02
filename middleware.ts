import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Exclude login and admin paths from internationalization
  // These paths should work without locale prefixes
  if (pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/employee')) {
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

