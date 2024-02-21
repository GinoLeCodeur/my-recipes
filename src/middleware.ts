import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const session = await getToken({ req, secret });

    if (session && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', req.url));
    }
}
