import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex justify-center w-full p-4 border-t border-[#ece6e0]">
            <div className="flex justify-center w-full max-w-screen-xl text-sm">
                Made with{' '}
                <span className="material-symbols-outlined block mx-1 text-[#f00] ms-fill">
                    favorite
                </span>{' '}
                by{' '}
                <Link
                    href="https://www.lecodeur.nl/"
                    target="_blank"
                    className="ml-1"
                >
                    Gino Le Codeur
                </Link>
                .
            </div>
        </footer>
    );
}