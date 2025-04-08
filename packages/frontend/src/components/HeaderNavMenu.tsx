"use client";
import { Navbar, NavbarContent } from "@heroui/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Avatar } from "@heroui/react";
import { NavLink } from "@/components/NavLink";
import Link from "next/link";

export const HeaderNavMenu = ({ className }: { className?: string }) => (
  <Navbar className={className}>
    <NavbarContent>
      <NavLink href="/">Direkte</NavLink>
      <NavLink href="/archive">Mediatek</NavLink>
      <NavLink href="/schedule">Sendeplan</NavLink>
      <NavLink href="/about">Om oss</NavLink>
    </NavbarContent>
    <NavbarContent justify={"end"}>
      <ThemeSwitcher />
      <Link href="/login">
        <Avatar showFallback />
      </Link>
    </NavbarContent>
  </Navbar>
);
