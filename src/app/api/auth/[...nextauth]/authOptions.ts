import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const response = await sql`
                    SELECT 
                        user_id AS "userId", 
                        email, 
                        password,
                        name,
                        role
                    FROM users 
                    WHERE email = ${credentials?.email}`;

                const user = response.rows[0];

                const passwordCorrect = await compare(
                    credentials?.password || '',
                    user.password
                );

                if (passwordCorrect) {
                    return {
                        userId: user.userId,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    } as any;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = user as any;
            }

            return token;
        },
        session({ session, token }) {
            session.user = token.user as any;

            return session;
        },
    },
};