import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Column {
  id: string;
  title: string;
}

interface ColumnProps {
  column: Column;
  children: React.ReactNode;
}

export function Column({ column, children }: ColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      // Explicitly mark this as a droppable area
      type: "droppable",
    },
  });

  const combinedRef = (node: HTMLElement | null) => {
    setNodeRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={combinedRef}
      style={style}
      className="w-80 bg-card rounded-lg p-4 touch-none border border-border"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <h3 className="font-semibold mb-4 text-card-foreground">
          {column.title}
        </h3>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}
