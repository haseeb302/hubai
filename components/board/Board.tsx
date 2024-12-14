"use client";

import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { AddTask } from "./AddTask";
import { ProjectSelector } from "./ProjectSelector";

import { Project, Task } from "./types";
import { initialProjects } from "@/lib/constants";

export function Board({ projectId }: { projectId: string }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState(
    projectId !== undefined ? projectId : projects[0].id
  );

  const currentProject = projects.find((p) => p.id === currentProjectId)!;

  const handleAddTask = (newTask: {
    title: string;
    description: string;
    status: string;
  }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProjectId
          ? { ...project, tasks: [...project.tasks, task] }
          : project
      )
    );
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === "Column") {
      if (active.id !== over.id) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id !== currentProjectId) return project;

            const oldIndex = project.columns.findIndex(
              (col) => col.id === active.id
            );
            const newIndex = project.columns.findIndex(
              (col) => col.id === over.id
            );

            const newColumns = [...project.columns];
            const [removed] = newColumns.splice(oldIndex, 1);
            newColumns.splice(newIndex, 0, removed);

            return { ...project, columns: newColumns };
          })
        );
      }
      return;
    }

    const activeTask = currentProject.tasks.find(
      (task) => task.id === active.id
    );
    const overColumn = over.id;

    if (activeTask && activeTask.status !== overColumn) {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id !== currentProjectId) return project;

          const updatedTasks = project.tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: overColumn.toString() }
              : task
          );

          return { ...project, tasks: updatedTasks };
        })
      );
    }
  }

  return (
    <div>
      {/* <ProjectSelector
        projects={projects}
        currentProjectId={currentProjectId}
        onProjectChange={setCurrentProjectId}
      /> */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext
          items={currentProject.columns}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 p-4">
            {currentProject.columns.map((column) => (
              <Column key={column.id} column={column}>
                {currentProject.tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                <AddTask columnId={column.id} onAdd={handleAddTask} />
              </Column>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
