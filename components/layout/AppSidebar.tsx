"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Plus,
  Bot,
  KanbanSquare,
  Folders,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { initialProjects, initialChats } from "@/lib/constants";
import { ProjectsList } from "../projects/ProjectList";
import { ChatList } from "../chat/ChatList";
import { SignOutButton } from "../auth/SignOut";

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
    href: "/chat", // Updated to point to first chat
    color: "text-violet-500",
  },
  {
    label: "Board",
    icon: KanbanSquare,
    href: "/board",
    color: "text-orange-500",
  },
  // {
  //   label: "New Project",
  //   icon: Plus,
  //   href: "/projects/new",
  //   color: "text-green-500",
  // adminOnly: true, // Add this property
  // },
  {
    label: "Projects",
    icon: Folders,
    href: "/projects",
    color: "text-gray-500",
    adminOnly: true, // Add this property
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar(); // Get sidebar collapsed state

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton className="flex items-center px-4 py-2">
          <Bot className="text-primary" height={16} width={16} />
          <span className="text-lg font-semibold">HubAI</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <Link href={route.href}>
                    <SidebarMenuButton
                      className={cn(
                        "w-full",
                        pathname === route.href
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "transparent"
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      <span>{route.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Boards - Only show on /board route */}
        {pathname.startsWith("/board") && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Boards</SidebarGroupLabel>
            <SidebarGroupContent>
              <ProjectsList slug={"board"} />
              <SidebarMenuItem>
                <Link href={`/projects/new`}>
                  <SidebarMenuButton>
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {pathname.startsWith("/chat") && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <ChatList />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {pathname.startsWith("/projects") && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <ProjectsList slug={"projects"} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle iconOnly={!open} />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SignOutButton iconOnly={!open} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
