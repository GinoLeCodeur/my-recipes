'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function UserMenu() {
    const { data: session } = useSession();

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsExpanded(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

    return (
        <div ref={ref} className="relative py-4">
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
                    <li>
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
                ) : (
                    <li>
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
