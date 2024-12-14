import { ProjectManager } from "@/components/projects/ProjectManager";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .single();

  if (!project) {
    redirect("/");
  }

  return (
    <div className="container mx-auto">
      <ProjectManager projectId={project.id} projectName={project.name} />
    </div>
  );
}
