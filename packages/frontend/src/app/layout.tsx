import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {HeaderNavMenu as HeaderNavMenu} from "../components/HeaderNavMenu";
import {Logo} from "@/components/Logo";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
import {Providers} from "@/app/providers";
import {ReactNode} from "react";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className=" light" style={{colorScheme:"light"}}>
        <head>
            <title>Frikanalen</title>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
            <div className="flex flex-col items-center min-h-screen">
                <header className="w-full max-w-2xl">
                    <Logo className="w-100 pt-10"/>
                    <HeaderNavMenu className="py-3"/>
                </header>
                <div className="w-full max-w-2xl grow">{children}</div>
                <footer>Footer.</footer>
            </div>
        </Providers>
        </body>
        </html>
    );
}
