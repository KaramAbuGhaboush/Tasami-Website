import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
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
  
  // Redirect old locale-based URLs to new structure (e.g., /en/about -> /about)
  const localeMatch = pathname.match(/^\/(en|ar)(\/.*)?$/);
  if (localeMatch) {
    const newPath = localeMatch[2] || '/';
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url);
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
  
  // Allow all other paths through
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … static assets like fonts, images
  matcher: [
    '/',
    '/((?!api|_next|_vercel|Font|fonts|images|.*\\..*).*)'
  ]
};

