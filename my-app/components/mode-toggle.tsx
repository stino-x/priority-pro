"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export function ModeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const element = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set theme from localStorage or system preference
    const onWindowMatch = () => {
      if (storedTheme === "dark" || (!storedTheme && darkQuery.matches)) {
        element.classList.add("dark");
        setTheme("dark");
      } else {
        element.classList.remove("dark");
        setTheme("light");
      }
    };

    onWindowMatch();

    // Watch for system-level theme changes
    const darkQueryListener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          element.classList.add("dark");
          setTheme("dark");
        } else {
          element.classList.remove("dark");
          setTheme("light");
        }
      }
    };

    darkQuery.addEventListener("change", darkQueryListener);

    return () => {
      darkQuery.removeEventListener("change", darkQueryListener);
    };
  }, []);

  // Update theme based on user's selection
  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full w-8 h-8 bg-background"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
          >
            <SunIcon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
            <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
