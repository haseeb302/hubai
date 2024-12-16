import { auth } from "@/auth";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

export default async function ChatPage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;
  const { projectId } = await searchParams;
  if (id && projectId) {
    return (
      <div className="h-full">
        <ChatInterface projectId={projectId} chatId={id} />
      </div>
    );
  }
}
