import { auth } from "@/auth";
import { Board } from "@/components/board/Board";
import { redirect } from "next/navigation";

export default async function BoardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <Board
      projectId={params.id}
      userId={"4fd68587-207a-405f-a405-58fb52001a31"}
    />
  );
}
