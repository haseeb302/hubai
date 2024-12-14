"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, MessageCircle, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Chat",
      icon: MessageCircle,
      href: "/chat",
      color: "text-violet-500",
    },
    {
      label: "Board",
      icon: LayoutDashboard,
      href: "/board",
      color: "text-orange-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-gray-500",
    },
  ];

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  pathname === route.href
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "transparent"
                )}
              >
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
