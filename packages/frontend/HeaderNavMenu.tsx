import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { ReactNode } from "react"

const NavLink = ({
  href, children
}: {
  href: string, children: ReactNode
}) => (
  <NavigationMenuItem>
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {children}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
)

export const HeaderNavMenu = ({ className }: { className?: string }) => (
  <NavigationMenu className={className}>
    <NavigationMenuList>
      <NavLink href="/">Direkte</NavLink>
      <NavLink href="/archive">Mediatek</NavLink>
      <NavLink href="/schedule">Sendeplan</NavLink>
      <NavLink href="/about">Om oss</NavLink>
    </NavigationMenuList>
  </NavigationMenu>
);
