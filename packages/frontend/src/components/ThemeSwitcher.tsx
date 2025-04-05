"use client";
import dynamic from "next/dynamic";

const ThemeSwitcherBrowser = dynamic(() => import('./ThemeSwitcherBrowser'), {ssr: false});

export const ThemeSwitcher = () => (<ThemeSwitcherBrowser/>)