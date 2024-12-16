// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
import { auth } from "@/auth";
import { ProjectUpload } from "@/components/projects/ProjectUpload";
import { redirect } from "next/navigation";
// import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  // const supabase = createServerComponentClient({ cookies });

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/login");
  // }

  // // Check if user is admin
  // const { data: user } = await supabase
  //   .from("users")
  //   .select("role")
  //   .eq("id", session.user.id)
  //   .single();

  // if (user?.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-center text-2xl font-bold mb-8">
        Create New Project
      </h1>
      <ProjectUpload userId={"4fd68587-207a-405f-a405-58fb52001a31"} />
    </div>
  );
}
