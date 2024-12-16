import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Column, Task } from "@/components/board/types";

export function useBoard(projectId: string, userId: string) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoard();
  }, [projectId]);

  const loadBoard = async () => {
    try {
      setLoading(true);

      // Load columns with explicit ordering
      const { data: columnsData, error: columnsError } = await supabase
        .from("project_columns")
        .select("*")
        .eq("project_id", projectId)
        .order("column_order", { ascending: true });

      if (columnsError) throw columnsError;

      // Load tasks with explicit ordering
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assigned_to (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .eq("project_id", projectId)
        .order("task_order", { ascending: true });

      if (tasksError) throw tasksError;

      if (columnsData) setColumns(columnsData);
      if (tasksData) setTasks(tasksData);
    } catch (error) {
      console.error("Error loading board:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const updateTaskColumn = async (
  //     taskId: string,
  //     columnId: string,
  //     newPosition: number
  //   ) => {
  //     try {
  //       console.log("CID", columnId);
  //       console.log("TID", taskId);
  //       console.log("NPos", newPosition);
  //       // Store the current state for rollback if needed
  //       const previousTasks = [...tasks];
  //       // Optimistically update the UI
  //       setTasks((prev) => {
  //         const updated = prev.map((task) =>
  //           task.id === taskId
  //             ? { ...task, column_id: columnId, task_order: newPosition }
  //             : task
  //         );
  //         return updated.sort((a, b) => a.task_order - b.task_order);
  //       });
  //       console.log("DATA");

  //       const x = await supabase
  //         .from("tasks")
  //         .update({
  //           column_id: columnId,
  //           task_order: newPosition,
  //         })
  //         .match({
  //           id: taskId,
  //           project_id: projectId,
  //         }); // Add project_id to match
  //       console.log("DATA", x);
  //       //   if (error) {
  //       //     // Rollback on error
  //       //     setTasks(previousTasks);
  //       //     loadBoard();
  //       //     throw error;
  //       //   }

  //       // Don't immediately reload - let the optimistic update persist
  //       // await loadBoard();
  //     } catch (error) {
  //       console.error("Error updating task:", error);
  //       await loadBoard(); // Reload on error to restore correct state
  //     }
  //   };

  const updateTaskColumn = async (
    taskId: string,
    columnId: string,
    newPosition: number
  ) => {
    try {
      // Optimistically update the UI
      setTasks((prev) => {
        const updated = prev.map((task) =>
          task.id === taskId
            ? { ...task, column_id: columnId, task_order: newPosition }
            : task
        );
        return updated.sort((a, b) => a.task_order - b.task_order);
      });

      const { error } = await supabase
        .from("tasks")
        .update({
          column_id: columnId,
          task_order: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select();

      if (error) throw error;

      // Reload the board to ensure consistency
      await loadBoard();
    } catch (error) {
      console.error("Error updating task:", error);
      await loadBoard(); // Reload on error
    }
  };

  //   const updateTaskColumn = async (
  //     taskId: string,
  //     columnId: string,
  //     newPosition: number
  //   ) => {
  //     try {
  //       const { error } = await supabase
  //         .from("tasks")
  //         .update({
  //           column_id: columnId,
  //           task_order: newPosition,
  //           updated_at: new Date().toISOString(),
  //         })
  //         .eq("id", taskId);

  //       if (error) throw error;
  //       await loadBoard();
  //     } catch (error) {
  //       console.error("Error updating task:", error);
  //     }
  //   };

  //   const updateColumnPosition = async (
  //     columnId: string,
  //     newPosition: number
  //   ) => {
  //     try {
  //       console.log("CID", columnId);
  //       console.log("NPos", newPosition);
  //       const previousColumns = [...columns];

  //       // Optimistically update the UI
  //       setColumns((prev) => {
  //         const updated = prev.map((col) =>
  //           col.id === columnId ? { ...col, column_order: newPosition } : col
  //         );
  //         return updated.sort((a, b) => a.column_order - b.column_order);
  //       });

  //       const { error } = await supabase
  //         .from("project_columns")
  //         .update({
  //           column_order: newPosition,
  //         })
  //         .match({ id: columnId, project_id: projectId }); // Add project_id to match

  //       if (error) {
  //         // Rollback on error
  //         setColumns(previousColumns);
  //         await loadBoard();
  //         throw error;
  //       }

  //       // Don't immediately reload - let the optimistic update persist
  //       // await loadBoard();
  //     } catch (error) {
  //       console.error("Error updating column:", error);
  //       await loadBoard(); // Reload on error to restore correct state
  //     }
  //   };

  const updateColumnPosition = async (
    columnId: string,
    newPosition: number
  ) => {
    try {
      // Optimistically update the UI
      setColumns((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId ? { ...col, column_order: newPosition } : col
        );
        return updated.sort((a, b) => a.column_order - b.column_order);
      });

      const { error } = await supabase
        .from("project_columns")
        .update({
          column_order: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", columnId)
        .select();

      if (error) throw error;

      // Reload the board to ensure consistency
      //   await loadBoard();
    } catch (error) {
      console.error("Error updating column:", error);
      await loadBoard(); // Reload on error
    }
  };

  //   const updateColumnPosition = async (
  //     columnId: string,
  //     newPosition: number
  //   ) => {
  //     try {
  //       const { error } = await supabase
  //         .from("project_columns")
  //         .update({
  //           column_order: newPosition,
  //           updated_at: new Date().toISOString(),
  //         })
  //         .eq("id", columnId);

  //       if (error) throw error;
  //       await loadBoard();
  //     } catch (error) {
  //       console.error("Error updating column:", error);
  //     }
  //   };

  const addTask = async (columnId: string, task: Partial<Task>) => {
    try {
      console.log("CID: ", columnId);
      console.log("task: ", task);
      // Get the highest position in the column
      const { data: tasks } = await supabase
        .from("tasks")
        .select("task_order")
        .eq("column_id", columnId)
        .order("task_order", { ascending: false })
        .limit(1);
      console.log("TASKS: ", tasks);
      const newPosition =
        tasks && tasks.length > 0 ? tasks[0].task_order + 1 : 1;
      console.log("NEW POSITION: ", newPosition);
      console.log("USER ID: ", userId);
      console.log("ProjectID: ", projectId);
      const { error } = await supabase.from("tasks").insert({
        ...task,
        project_id: projectId,
        column_id: columnId,
        task_order: newPosition,
        created_by: userId,
      });

      if (error) throw error;
      await loadBoard();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const addColumn = async (title: string) => {
    try {
      // Get the highest position
      const { data: columns } = await supabase
        .from("project_columns")
        .select("column_order")
        .eq("project_id", projectId)
        .order("column_order", { ascending: false })
        .limit(1);

      const newPosition =
        columns && columns.length > 0 ? columns[0].column_order + 1 : 1;

      const { error } = await supabase.from("project_columns").insert({
        title,
        project_id: projectId,
        column_order: newPosition,
      });

      if (error) throw error;
      await loadBoard();
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  return {
    columns,
    tasks,
    loading,
    updateTaskColumn,
    updateColumnPosition,
    addTask,
    addColumn,
    refreshBoard: loadBoard,
  };
}
