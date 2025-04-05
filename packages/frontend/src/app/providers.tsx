// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
