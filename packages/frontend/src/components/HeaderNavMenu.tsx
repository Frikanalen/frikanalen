import Link from "next/link";


import {ReactNode} from "react"
import {Navbar, NavbarContent, NavbarItem} from "@heroui/navbar";
import {ThemeSwitcher} from "./ThemeSwitcher";

const NavLink = ({href, children}: {
    href: string,
    children: ReactNode
}) => (
    <NavbarItem>
        <Link href={href}>
            {children}
        </Link>
    </NavbarItem>
)

export const HeaderNavMenu = ({className}: { className?: string }) => (
    <Navbar className={className}>
        <NavbarContent>
            <NavLink href="/">Direkte</NavLink>
            <NavLink href="/archive">Mediatek</NavLink>
            <NavLink href="/schedule">Sendeplan</NavLink>
            <NavLink href="/about">Om oss</NavLink>
            <ThemeSwitcher/>
        </NavbarContent>
    </Navbar>
);
