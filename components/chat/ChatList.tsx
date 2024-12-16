"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface Conversation {
  id: string;
  project_id: string;
  messages: any[];
}

export function ChatList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [conversations, setConversations] = useState<
    Record<string, Conversation[]>
  >({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // Fetch projects
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (projectsData) {
      setProjects(projectsData);

      // Fetch conversations for each project
      const convsByProject: Record<string, Conversation[]> = {};
      for (const project of projectsData) {
        const { data: convsData } = await supabase
          .from("conversations")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false });
        if (convsData) {
          convsByProject[project.id] = convsData;
        }
      }
      setConversations(convsByProject);
    }
  };

  return (
    <>
      {projects.map((project) => (
        <SidebarGroup key={project.id}>
          <SidebarHeader className="flex flex-row">
            <FolderOpen className="h-4 w-4" />
            <span>{project.name}</span>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations[project.id]?.map((conv, idx) => (
                <SidebarMenuItem key={conv.id}>
                  <Link href={`/chat/${conv.id}?projectId=${project.id}`}>
                    <SidebarMenuButton>
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat {idx + 1}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Link href={`/chat/new?projectId=${project.id}`}>
                  <SidebarMenuButton>
                    <Plus className="h-4 w-4" />
                    <span>New Chat</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
