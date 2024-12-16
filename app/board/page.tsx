// import { Board } from "@/components/board/Board";
// import { initialProjects } from "@/lib/constants";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BoardIndexPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="h-full">
      {/* <ChatInterface projectId={params.projectId} chatId={params.chatId} /> */}
    </div>
  );
}
