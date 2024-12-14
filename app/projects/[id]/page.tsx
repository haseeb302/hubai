import { ProjectManager } from "@/components/projects/ProjectManager";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProjectPage({ params }) {
  const { id } = await params;
  console.log("id", id);
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/");
  }

  return (
    <div className="container mx-auto">
      <ProjectManager
        projectId={project.id}
        projectName={project.name}
        userId={"4fd68587-207a-405f-a405-58fb52001a31"}
      />
    </div>
  );
}
