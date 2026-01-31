import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/login') {
            return supabaseResponse;
        }

        const sessionCookie = request.cookies.get('admin_session')?.value;
        if (!sessionCookie) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }

        // Validate session JWT
        try {
            const { decrypt } = await import('@/lib/auth')
            const session = await decrypt(sessionCookie)

            // Check if session is expired
            if (session.expires && new Date(session.expires) < new Date()) {
                const url = request.nextUrl.clone()
                url.pathname = '/admin/login'
                return NextResponse.redirect(url)
            }
        } catch (error) {
            // Invalid or corrupted session
            console.error('[Middleware] Invalid admin session:', error)
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
