import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// export const createTaskTool = (projectId: string, userId: string) => {
//   return new DynamicStructuredTool({
//     name: "create_task",
//     description: "Create a new task in the project board",
// schema: z.object({
//   title: z.string().describe("The title of the task"),
//   description: z.string().describe("The description of the task"),
//   columnId: z.string().describe("The ID of the column to add the task to"),
//   projectId: z
//     .string()
//     .describe("The ID of the project to add the task to"),
// }),
//     func: async ({ title, description, columnId, projectId }) => {
//       try {
//         // Get the highest position in the column
//         const { data: tasks } = await supabase
//           .from("tasks")
//           .select("task_order")
//           .eq("column_id", columnId)
//           .eq("project_id", projectId)
//           .order("task_order", { ascending: false })
//           .limit(1);

//         const newPosition =
//           tasks && tasks.length > 0 ? tasks[0].task_order + 1000 : 1000;

//         const { error } = await supabase.from("tasks").insert({
//           title,
//           description,
//           project_id: projectId,
//           column_id: columnId,
//           task_order: newPosition,
//           created_by: userId,
//         });

//         if (error) throw error;
//         return `Successfully created task: ${title}`;
//       } catch (error: unknown) {
//         return `Error creating task: ${error?.message}`;
//       }
//     },
//   });
// };

export const createTaskTool = {
  name: "CreateTask",
  description: "Create a new task in the project board",
  schema: z.object({
    title: z.string().describe("The title of the task"),
    description: z.string().describe("The description of the task"),
    column_id: z.string().describe("The ID of the column to add the task to"),
    project_id: z.string().describe("The ID of the project to add the task to"),
  }),
};

export const queryProjectTool = {
  name: "AnswerQuery",
  description: "Query the project board",
  schema: z.object({
    response: z.string().describe("The response to the query"),
  }),
};
