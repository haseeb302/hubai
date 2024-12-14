"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/store/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  iconOnly?: boolean;
}

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (iconOnly) {
    return (
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-secondary"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-300",
        "hover:bg-secondary",
        "text-muted-foreground hover:text-foreground"
      )}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
}
