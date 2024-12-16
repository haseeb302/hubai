// import { ChatInterface } from "@/components/chat/ChatInterface";
// import { supabase } from "@/lib/supabase";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  // Get the conversation to find its project_id

  return (
    <div className="h-full">
      {/* <ChatInterface projectId={params.projectId} chatId={params.chatId} /> */}
    </div>
  );
}
