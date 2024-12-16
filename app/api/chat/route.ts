import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabase } from "@/lib/supabase";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { createTaskTool, queryProjectTool } from "@/lib/tools";

// const toolSchema = z.object({});
// // Define the schema for task suggestions
// const tool = z.object({
//   response: z.string().describe("The AI's response to the user's message"),
//   shouldCreateTasks: z
//     .boolean()
//     .describe("Whether tasks should be created based on the conversation"),
//   tasks: z
//     .array(
//       z.object({
//         title: z.string().describe("The title of the task"),
//         description: z.string().describe("A detailed description of the task"),
//         columnId: z
//           .string()
//           .describe("The ID of the column to add the task to"),
//         projectId: z
//           .string()
//           .describe("The ID of the project to add the task to"),
//       })
//     )
//     .optional()
//     .describe("Array of tasks to be created"),
//   reasoning: z
//     .string()
//     .describe("Explanation for why tasks were suggested or not"),
// });

export async function POST(req: Request) {
  try {
    const { message, projectId, chatId } = await req.json();

    // Get chat history
    const { data: chatData } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", chatId)
      .order("created_at", { ascending: true });

    // Initialize embeddings and vector store
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    });

    // Search for relevant documents
    const relevantDocs = await vectorStore.similaritySearch(message, 3, {
      filter: { project_id: projectId },
    });

    // Prepare context from relevant documents
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

    // Get available columns for task creation
    const { data: columns } = await supabase
      .from("project_columns")
      .select("id, title")
      .eq("project_id", projectId);

    // userId={"4fd68587-207a-405f-a405-58fb52001a31"}
    // const taskTool = createTaskTool(
    //   projectId,
    //   "4fd68587-207a-405f-a405-58fb52001a31"
    // );

    // Initialize chat model
    const chat = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      maxRetries: 3,
    });

    const chatWithTools = chat.bindTools([createTaskTool], {
      strict: true,
    });

    console.log("chat instance: ", chat);

    // Format chat history properly
    const formattedHistory =
      chatData?.map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage({
            content: msg.content,
          });
        } else {
          return new AIMessage({
            content: msg.content,
          });
        }
      }) || [];

    const messages = [
      new SystemMessage(
        `You are HubAI, a helpful AI assistant and help as a project manager".             

          Guidelines:
          1. Use the chat history to maintain context of the conversation
          2. Answer any questions based on both the project documents and previous messages
          3. When users discuss work items, meetings, or tasks, analyze if they should be added to the project board and use any of the providedtools to do so.
          4. If tasks should be created, suggest them with clear titles and descriptions.
          5. Assign tasks to appropriate columns based on their nature
          6. Use the provided project context to make informed suggestions.
          7. If information isn't found in either context or history, say "I don't have enough information to answer that question"
          8. Be concise and friendly          
          You have access to the following tools:
          ${JSON.stringify(createTaskTool)} ${JSON.stringify(queryProjectTool)}

        
          Available columns for tasks: ${JSON.stringify(columns)}
          
          Project Context:
          ${context}`
      ),
      ...formattedHistory,
      new HumanMessage(message),
    ];

    // Generate response
    const response = await chatWithTools.invoke(messages);
    console.log("tool calls: ", response.tool_calls);
    if (response.tool_calls && response?.tool_calls?.length > 0) {
      return Response.json({
        content: response.tool_calls,
        toolCalls: true,
      });
    } else {
      return Response.json({
        content: response.content,
        toolCalls: false,
      });
    }
    // Extract tasks and response
    // const taskSuggestions = response.shouldCreateTasks ? response.tasks : [];
    // console.log("taskSuggestions: ", taskSuggestions);
    // const aiResponse = response.response;
    // console.log("aiResponse: ", aiResponse);
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
