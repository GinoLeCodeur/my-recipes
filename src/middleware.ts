import { NextResponse, NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default withAuth(
    async function middleware(req: NextRequest) {
        const session = await getToken({ req, secret });

        if (session && req.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) =>
                !!token ||
                req.nextUrl.pathname.startsWith('/api') ||
                req.nextUrl.pathname.startsWith('/login'),
        },
    }
);

export const config = {
    matcher: [
        '/login',
        '/recipe/manage/:path*'
    ],
};