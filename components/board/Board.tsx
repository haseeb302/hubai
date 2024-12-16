"use client";

import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { AddTask } from "./AddTask";

// import { Project, Task } from "./types";
// import { initialProjects } from "@/lib/constants";

import { useBoard } from "@/hooks/useBoard";
import { Loader2 } from "lucide-react";
import { AddColumn } from "./AddColumn";
import { Task } from "./types";

export function Board({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const {
    columns,
    tasks,
    loading,
    updateTaskColumn,
    updateColumnPosition,
    addTask,
    addColumn,
  } = useBoard(projectId, userId);

  console.log("PID", projectId);

  // const [projects, setProjects] = useState<Project[]>(initialProjects);
  // const [currentProjectId, setCurrentProjectId] = useState(
  //   projectId !== undefined ? projectId : projects[0].id
  // );

  // const currentProject = projects.find((p) => p.id === currentProjectId)!;

  // const handleAddTask = (newTask: {
  //   title: string;
  //   description: string;
  //   status: string;
  // }) => {
  //   const task: Task = {
  //     id: Date.now().toString(),
  //     title: newTask.title,
  //     description: newTask.description,
  //     status: newTask.status,
  //   };

  //   setProjects((prevProjects) =>
  //     prevProjects.map((project) =>
  //       project.id === currentProjectId
  //         ? { ...project, tasks: [...project.tasks, task] }
  //         : project
  //     )
  //   );
  // };

  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;

  //   if (!over) return;

  //   if (active.data.current?.type === "Column") {
  //     if (active.id !== over.id) {
  //       setProjects((prevProjects) =>
  //         prevProjects.map((project) => {
  //           if (project.id !== currentProjectId) return project;

  //           const oldIndex = project.columns.findIndex(
  //             (col) => col.id === active.id
  //           );
  //           const newIndex = project.columns.findIndex(
  //             (col) => col.id === over.id
  //           );

  //           const newColumns = [...project.columns];
  //           const [removed] = newColumns.splice(oldIndex, 1);
  //           newColumns.splice(newIndex, 0, removed);

  //           return { ...project, columns: newColumns };
  //         })
  //       );
  //     }
  //     return;
  //   }

  //   const activeTask = currentProject.tasks.find(
  //     (task) => task.id === active.id
  //   );
  //   const overColumn = over.id;

  //   if (activeTask && activeTask.status !== overColumn) {
  //     setProjects((prevProjects) =>
  //       prevProjects.map((project) => {
  //         if (project.id !== currentProjectId) return project;

  //         const updatedTasks = project.tasks.map((task) =>
  //           task.id === activeTask.id
  //             ? { ...task, status: overColumn.toString() }
  //             : task
  //         );

  //         return { ...project, tasks: updatedTasks };
  //       })
  //     );
  //   }
  // }

  // const handleDragEnd = async (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   if (active.data.current?.type === "Column") {
  //     if (active.id !== over.id) {
  //       const activeColumn = columns.find((col) => col.id === active.id);
  //       const overColumn = columns.find((col) => col.id === over.id);

  //       if (activeColumn && overColumn) {
  //         // Update the position to be between the previous and next columns
  //         const allColumns = [...columns].sort(
  //           (a, b) => a.column_order - b.column_order
  //         );
  //         const overIndex = allColumns.findIndex(
  //           (col) => col.id === overColumn.id
  //         );
  //         let newPosition;
  //         if (overIndex === 0) {
  //           // Moving to start
  //           newPosition = allColumns[0].column_order - 1;
  //         } else if (overIndex === allColumns.length - 1) {
  //           // Moving to end
  //           newPosition = allColumns[allColumns.length - 1].column_order + 1;
  //         } else {
  //           // Moving between columns
  //           newPosition =
  //             (allColumns[overIndex - 1].column_order +
  //               allColumns[overIndex].column_order) /
  //             2;
  //         }
  //         await updateColumnPosition(activeColumn.id, newPosition);
  //       }
  //     }
  //     return;
  //   }

  //   const task = tasks.find((t) => t.id === active.id);
  //   const overColumn = columns.find((col) => col.id === over.id);

  //   if (task && overColumn && task.column_id !== overColumn.id) {
  //     // Get the highest position in the target column
  //     const columnTasks = tasks
  //       .filter((t) => t.column_id === overColumn.id)
  //       .sort((a, b) => a.task_order - b.task_order);
  //     let newPosition;
  //     if (columnTasks.length === 0) {
  //       // First task in column
  //       newPosition = 1;
  //     } else {
  //       // Calculate position based on surrounding tasks
  //       newPosition = columnTasks[columnTasks.length - 1].task_order + 1;
  //     }

  //     await updateTaskColumn(task.id, overColumn.id, newPosition);
  //   }
  // };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === "Column") {
      if (active.id !== over.id) {
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);
        const sortedColumns = [...columns].sort(
          (a, b) => a.column_order - b.column_order
        );

        let newPosition;
        // Moving left
        if (oldIndex > newIndex) {
          if (newIndex === 0) {
            newPosition = sortedColumns[0].column_order - 1000;
          } else {
            const prevColumn = sortedColumns[newIndex - 1];
            const targetColumn = sortedColumns[newIndex];
            newPosition =
              (prevColumn.column_order + targetColumn.column_order) / 2;
          }
        }
        // Moving right
        else {
          if (newIndex === sortedColumns.length - 1) {
            newPosition =
              sortedColumns[sortedColumns.length - 1].column_order + 1000;
          } else {
            const targetColumn = sortedColumns[newIndex];
            const nextColumn = sortedColumns[newIndex + 1];
            newPosition =
              (targetColumn.column_order + nextColumn.column_order) / 2;
          }
        }
        await updateColumnPosition(active.id.toString(), newPosition);
      }
      return;
    }

    // Handle task movement
    const task = active.data.current?.task;
    if (!task) return;

    const targetColumnId = over.id.toString();
    if (task.column_id !== targetColumnId) {
      const targetColumnTasks = tasks
        .filter((t) => t.column_id === targetColumnId)
        .sort((a, b) => a.task_order - b.task_order);

      const newPosition =
        targetColumnTasks.length > 0
          ? targetColumnTasks[targetColumnTasks.length - 1].task_order + 1
          : 999;

      await updateTaskColumn(task.id, targetColumnId, newPosition);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // return (
  //   <div>
  //     <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
  //       <SortableContext
  //         items={currentProject.columns}
  //         strategy={horizontalListSortingStrategy}
  //       >
  //         <div className="flex gap-4 p-4">
  //           {currentProject.columns.map((column) => (
  //             <Column key={column.id} column={column}>
  //               {currentProject.tasks
  //                 .filter((task) => task.status === column.id)
  //                 .map((task) => (
  //                   <TaskCard key={task.id} task={task} />
  //                 ))}
  //               <AddTask columnId={column.id} onAdd={handleAddTask} />
  //             </Column>
  //           ))}
  //         </div>
  //       </SortableContext>
  //     </DndContext>
  //   </div>
  // );
  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-4 p-4">
          {columns
            .sort((a, b) => a.column_order - b.column_order)
            .map((column) => (
              <Column key={column.id} column={column}>
                {tasks
                  .filter((task) => task.column_id === column.id)
                  .sort((a, b) => a.task_order - b.task_order)
                  .map((task: Task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                <AddTask columnId={column.id} onAdd={addTask} />
              </Column>
            ))}
          <AddColumn onAdd={addColumn} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
