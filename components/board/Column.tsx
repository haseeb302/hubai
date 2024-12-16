import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column as IColumn } from "./types";

export function Column({
  column,
  children,
}: {
  column: IColumn;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column: column,
    },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column: column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // const { setNodeRef: setDroppableRef } = useDroppable({
  //   id: column.id,
  //   data: {
  //     type: "Column",
  //     column_order: column.column_order,
  //   },
  // });
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  // const combinedRef = (node: HTMLElement | null) => {
  //   setNodeRef(node);
  //   setDroppableRef(node);
  // };

  return (
    <div
      ref={setNodeRef}
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
