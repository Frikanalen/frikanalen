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
                defaultSelected={theme === "light"}
                onChange={(event) => setTheme(event.target.checked ? "light" : "dark")}
                size="sm"
                thumbIcon={({isSelected, className}) =>
                    isSelected ? <SunIcon className={className}/> : <MoonIcon className={className}/>
                }
            >

                <span className={"hidden sr-only"}>Dark mode</span>
            </Switch>
    );
};

export default ThemeSwitcherBrowser;
