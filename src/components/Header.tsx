import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function Header() {
    return (
        <header className="flex flex-col items-center w-full border-b border-[#ece6e0]">
            <div className="w-full max-w-screen-xl px-4">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className={`flex items-center text-lg font-bold text-[var(--primary-color)]`}
                    >
                        <Image
                            src="/icon.svg"
                            alt="My recipes"
                            width={0}
                            height={0}
                            className="mr-2 w-auto h-[24px]"
                        />
                        My recipes
                    </Link>
                    <nav className="flex flex-1 justify-end">
                        <ul className="flex items-center gap-4">
                            <li>
                                <button className="py-4">
                                    <span className="block material-symbols-outlined">
                                        search
                                    </span>
                                </button>
                            </li>
                            <li>
                                <UserMenu />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="hidden">
                <label>
                    <input
                        type="text"
                        name="header-search"
                        placeholder="Search"
                    />
                </label>
            </div>
        </header>
    );
}