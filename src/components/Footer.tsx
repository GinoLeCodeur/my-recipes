import Link from "next/link";
import MaterialSymbol from "./MaterialSymbol";

export default function Footer() {
    return (
        <footer className="flex justify-center w-full py-4 border-t border-[#ece6e0]">
            <div className="flex justify-center w-full max-w-screen-xl text-sm">
                Made with{" "}
                <MaterialSymbol
                    name="favorite"
                    fill
                    className="mx-1 fill-[#f00]"
                    opticalSize={20}
                />{" "}
                by{" "}
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