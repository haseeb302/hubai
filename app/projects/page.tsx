import { auth } from "@/auth";
import { ProjectManager } from "@/components/projects/ProjectManager";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProjectPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const { data: project } = await supabase.from("projects").select("*");

  if (project && project?.length <= 0) {
    redirect("/");
  } else {
    return (
      <div className="container mx-auto">
        <ProjectManager
          projectId={project && project[0].id}
          projectName={project && project[0].name}
          userId={"4fd68587-207a-405f-a405-58fb52001a31"}
        />
      </div>
    );
  }
}
