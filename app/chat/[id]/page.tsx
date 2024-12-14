import { ChatInterface } from "@/components/chat/ChatInterface";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

export default async function ChatPage({ params, searchParams }: PageProps) {
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
