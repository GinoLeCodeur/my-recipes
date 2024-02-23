'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function UserMenu() {
    const { data: session } = useSession();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

    return (
        <div className="relative py-4" ref={wrapperRef}>
            <button
                type="button"
                className="block"
                aria-label="User menu"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="block material-symbols-outlined">
                    account_circle
                </span>
            </button>
            <ul
                className={`${
                    !isExpanded && 'hidden'
                } absolute right-0 top-[calc(100%+1px)] bg-white whitespace-nowrap`}
            >
                {session?.user ? (
                    <>
                        <li className="border-b border-[#ece6e0]">
                            <Link
                                href="/recipe/manage"
                                className="flex items-center px-4 py-2"
                                onClick={() => setIsExpanded(false)}
                            >
                                <span className="block material-symbols-outlined mr-2">
                                    settings_applications
                                </span>
                                Recepten beheren
                            </Link>
                        </li>
                        <li className="border-b border-[#ece6e0]">
                            <button
                                onClick={() => signOut()}
                                className="flex items-center px-4 py-2"
                            >
                                <span className="block material-symbols-outlined mr-2">
                                    logout
                                </span>
                                Uitloggen
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="border-b border-[#ece6e0]">
                        <Link
                            href="/login"
                            className="flex items-center px-4 py-2"
                            onClick={() => setIsExpanded(false)}
                        >
                            <span className="block material-symbols-outlined mr-2">
                                login
                            </span>
                            Inloggen
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}
