"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton({ iconOnly = false }: { iconOnly: boolean }) {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleSignOut}
        className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-secondary"
      >
        <LogOut className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-300 hover:bg-secondary text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
