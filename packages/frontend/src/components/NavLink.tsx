"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { NavbarItem } from "@heroui/react";
import Link from "next/link";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  const path = usePathname();

  const isActive = href === path;
  return (
    <NavbarItem isActive={isActive}>
      <Link href={href}>{children}</Link>
    </NavbarItem>
  );
};
