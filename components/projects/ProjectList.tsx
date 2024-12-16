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

export function ProjectsList({ slug }: { slug: string }) {
  const [projects, setProjects] = useState<Project[]>([]);

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
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.map((project) => (
            <SidebarMenuItem key={project.id}>
              <Link href={`/${slug}/${project.id}`}>
                <SidebarMenuButton>
                  <FolderOpen className="h-4 w-4" />
                  <span>{project.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {/* <SidebarMenuItem>
                <Link href={`/projects/new`}>
                  <SidebarMenuButton>
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
