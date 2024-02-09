import Image from "next/image";
import Link from "next/link";
import MaterialSymbol from "./MaterialSymbol";

export default function Header() {
    return (
        <header className="flex flex-col items-center w-full border-b border-[#ece6e0]">
            <div className="w-full max-w-screen-xl">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className={`flex text-lg font-bold text-[var(--primary-color)]`}
                    >
                        <Image src="/icon.svg" alt="My recipes" width="24" height="24" className="mr-2" />
                        My recipes
                    </Link>
                    <nav className="flex flex-1 justify-end">
                        <ul className="flex gap-4">
                            <li className="py-4">
                                <MaterialSymbol
                                    name="search"
                                    weight={200}
                                    className="cursor-pointer"
                                />
                            </li>
                            <li className="py-4">
                                <MaterialSymbol
                                    name="account_circle"
                                    weight={200}
                                    className="cursor-pointer"
                                />
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