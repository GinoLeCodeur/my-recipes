import type { Metadata } from "next";
import { notoSans } from "@/libs/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "My recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body className={`${notoSans.className} text-[#3a1e1f] bg-[var(--background-color)]`}>
              <div className="flex flex-col h-full min-h-screen justify-stretch items-center">
                  <Header />
                  {children}
                  <Footer />
              </div>
          </body>
      </html>
  );
}
