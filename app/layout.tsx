import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/store/ThemeProvider";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management AI",
  description: "AI-powered project management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 bg-background">
              <SidebarTrigger /> {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
