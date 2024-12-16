import { useDraggable } from "@dnd-kit/core";
import { Task } from "./types";

// interface TaskCardProps {
//   task: Task;
// }

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      type: "Task",
      task: task,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow cursor-move"
    >
      <h4 className="font-medium mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
      )}
    </div>
  );
}
