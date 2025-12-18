import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

export async function middleware(req: NextRequest) {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    // In production, you might want to return an error page instead
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // AUTHENTICATION DISABLED - Studio and projects routes are now publicly accessible
  // For studio routes, check authentication
  // if (req.nextUrl.pathname.startsWith('/studio')) {
  //   try {
  //     const supabase = createServerClient(
  //       supabaseUrl,
  //       supabaseAnonKey,
  //       {
  //         cookies: {
  //           get(name: string) {
  //             return req.cookies.get(name)?.value;
  //           },
  //           set(name: string, value: string, options: CookieOptions) {
  //             req.cookies.set({
  //               name,
  //               value,
  //               ...options,
  //             });
  //             response = NextResponse.next({
  //               request: {
  //                 headers: req.headers,
  //               },
  //             });
  //             response.cookies.set({
  //               name,
  //               value,
  //               ...options,
  //             });
  //           },
  //           remove(name: string, options: CookieOptions) {
  //             req.cookies.set({
  //               name,
  //               value: '',
  //               ...options,
  //             });
  //             response = NextResponse.next({
  //               request: {
  //                 headers: req.headers,
  //               },
  //             });
  //             response.cookies.set({
  //               name,
  //               value: '',
  //               ...options,
  //             });
  //           },
  //         },
  //       }
  //     );

  //     const { data: { user } } = await supabase.auth.getUser();

  //     if (!user) {
  //       // Redirect to login page
  //       const redirectUrl = req.nextUrl.clone();
  //       redirectUrl.pathname = '/login';
  //       redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
  //       return NextResponse.redirect(redirectUrl);
  //     }
  //   } catch (error) {
  //     // Log error in development only
  //     if (process.env.NODE_ENV === 'development') {
  //       console.error('Middleware error:', error);
  //     }
  //     // On error, redirect to login
  //     const redirectUrl = req.nextUrl.clone();
  //     redirectUrl.pathname = '/login';
  //     return NextResponse.redirect(redirectUrl);
  //   }
  // }

  return response;
}

export const config = {
  // AUTHENTICATION DISABLED - All routes are publicly accessible
  matcher: ['/studio/:path*', '/gallery/:path*'],
};
