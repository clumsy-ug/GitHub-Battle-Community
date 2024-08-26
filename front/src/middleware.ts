import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/home', '/test', '/communities', '/community'];

export async function middleware(req: NextRequest) {
    try {
        const res = NextResponse.next();
        const supabase = createMiddlewareClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();

        const path = req.nextUrl.pathname;

        // 保護されたパスのチェックを関数化
        const isProtectedPath = (path: string) => {
            return protectedPaths.some(protectedPath => 
                path === protectedPath || // 完全一致
                path.startsWith(`${protectedPath}/`) // パスで始まる（サブパスを含む）
            );
        };

        if (isProtectedPath(path) && !session) {
            const redirectUrl = new URL('/login', req.url);
            redirectUrl.searchParams.set('redirectTo', path);
            return NextResponse.redirect(redirectUrl);
        }

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}
export const config = {
    matcher: [
        '/home/:path*',
        '/test/:path*',
        '/community/:path*',
        '/communities/:path*',
        '/login'
    ],
}