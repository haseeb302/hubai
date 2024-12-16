import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: { projectId: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  // Create a new conversation with a hardcoded user ID
  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      project_id: searchParams.projectId,
      created_by: "4fd68587-207a-405f-a405-58fb52001a31", // Hardcoded user ID (same as in ProjectUpload)
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return redirect("/");
  }

  // Redirect to the new conversation
  redirect(`/chat/${conversation.id}`);
}
