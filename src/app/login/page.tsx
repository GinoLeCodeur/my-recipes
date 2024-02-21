'use client';

import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function Home() {
    const router = useRouter();

    const [loginData, setLoginData] = useState<User>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setLoginData((values) => ({ ...values, [name]: value }));
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);
        setError('');

        const loginResponse = await signIn('credentials', {
            email: loginData.email,
            password: loginData.password,
            redirect: false
        });
        
        if (loginResponse?.status === 200) {
            router.push('/');
            router.refresh();
        } else {
            setError('Het e-mailadres of wachtwoord is onjuist.');
        }

        setLoading(false);
    };

    return (
        <div className="flex-1 flex justify-center w-full max-w-screen-xl py-4">
            <form
                onSubmit={handleLogin}
                className="flex flex-col w-full max-w-[360px]"
            >
                <h1 className="text-4xl font-medium mb-4 text-[#955961]">
                    Login
                </h1>
                {error.length > 0 &&
                    <p className="mb-4 text-red-700">{error}</p>
                }
                <label className="flex flex-col mb-4">
                    E-mailadres
                    <input
                        name="email"
                        type="text"
                        placeholder="E-mailadres"
                        className="mt-1 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                        onChange={handleChange}
                    />
                </label>
                <label className="flex flex-col mb-4">
                    Wachtwoord
                    <input
                        name="password"
                        type="password"
                        placeholder="Wachtwoord"
                        className="mt-1 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                        onChange={handleChange}
                    />
                </label>
                <button
                    type="submit"
                    className="p-2 text-center bg-[#955961] text-white disabled:bg-[#e5e5e5] disabled:text-[#acacac] disabled:cursor-wait"
                    disabled={loading}
                >
                    Inloggen
                </button>
            </form>
        </div>
    );
}
