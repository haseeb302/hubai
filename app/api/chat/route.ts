import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabase } from "@/lib/supabase";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";

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

    // Initialize chat model
    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

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
          You should:
          1. Use the chat history to maintain context of the conversation
          2. Answer questions based on both the project documents and previous messages
          3. If information isn't found in either context or history, say "I don't have enough information"
          4. Be concise and friendly
  
          Project Context:\n${context}`
      ),
      ...formattedHistory,
      new HumanMessage(message),
    ];

    console.log("Messages: ", messages);

    // Generate response
    const response = await chat.invoke(messages);
    return Response.json({ content: response.content });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
