import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get visitor information
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'Unknown';
  
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const referer = request.headers.get('referer') || 'Direct';
  const path = request.nextUrl.pathname;
  const timestamp = new Date().toISOString();

  // Log visit clearly
  console.log('\n' + '='.repeat(80));
  console.log('🌐 WEBSITE VISIT');
  console.log('='.repeat(80));
  console.log(`⏰ Timestamp:    ${timestamp}`);
  console.log(`📍 IP Address:   ${ip}`);
  console.log(`🔗 Page:         ${path}`);
  console.log(`🔙 Referrer:     ${referer}`);
  console.log(`💻 User Agent:   ${userAgent}`);
  console.log('='.repeat(80) + '\n');

  return NextResponse.next();
}

// Configure which paths to track
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
