import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export default auth(async (request) => {
  if (!request.auth) {
    return NextResponse.redirect(new URL('/sign_in', request.url));
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust this to specific origins as needed
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Expose-Headers', 'X-Custom-Header');
  response.headers.set('Access-Control-Max-Age', '3600');

  return response;
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|sign_in|forget_password|reset_password|accept_invitation|terms|privacy).*)',
  ],
};
