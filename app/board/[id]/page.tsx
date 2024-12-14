import { Board } from "@/components/board/Board";

export default function BoardPage({ params }: { params: { id: string } }) {
  return <Board projectId={params.id} />;
}
