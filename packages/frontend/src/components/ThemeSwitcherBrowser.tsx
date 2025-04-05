// app/components/ThemeSwitcher.tsx
"use client";

import {useEffect, useState} from "react";
import {Switch} from "@heroui/switch";
import {useTheme} from "@heroui/use-theme";
import {SunIcon} from "@/components/SunIcon";
import {MoonIcon} from "@/components/MoonIcon";

export const ThemeSwitcherBrowser = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Switch
            defaultSelected={theme === "dark"}
            onChange={(event) => setTheme(event.target.checked ? "dark" : "light")}
            color="success"
            endContent={<MoonIcon/>}
            size="lg"
            startContent={<SunIcon/>}
        >
            Dark mode
        </Switch>
    );
};

export default ThemeSwitcherBrowser;
