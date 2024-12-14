"use client";

import { Project } from "./types";

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export function ProjectSelector({
  projects,
  currentProjectId,
  onProjectChange,
}: ProjectSelectorProps) {
  return (
    <div className="mb-4">
      <select
        value={currentProjectId}
        onChange={(e) => onProjectChange(e.target.value)}
        className="p-2 border border-input rounded-md bg-background"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
