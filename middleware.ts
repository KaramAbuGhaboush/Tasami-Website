import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    
    // Exclude API routes, static assets, and Vercel internal routes
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/_vercel') ||
      pathname.startsWith('/Font') || 
      pathname.startsWith('/fonts') || 
      pathname.startsWith('/images') ||
      pathname.match(/\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif|ico|webp)$/i)
    ) {
      return NextResponse.next();
    }
    
    // Check for protected routes (admin and employee)
    // Note: Full authentication verification happens in page components/API routes
    // This middleware only checks for the presence of auth cookie
    if (pathname.startsWith('/admin') || pathname.startsWith('/employee')) {
      // Check for auth cookie
      const authToken = request.cookies.get('auth-token')?.value;
      
      if (!authToken) {
        // Redirect to login page
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      
      // Allow through - actual token verification happens in page components
      // which run in Node.js runtime and can use Prisma/JWT
      return NextResponse.next();
    }
    
    // Exclude login path from internationalization
    // Login path should work without locale prefixes
    if (pathname.startsWith('/login')) {
      return NextResponse.next();
    }
    
    // Apply next-intl middleware for all other paths
    return intlMiddleware(request);
  } catch (error) {
    // If middleware fails, allow the request to continue
    // This prevents the entire site from breaking
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
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

