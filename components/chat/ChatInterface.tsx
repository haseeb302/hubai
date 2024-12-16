"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

import { TaskSuggestion } from "./TaskSuggestion";
import { useBoard } from "@/hooks/useBoard";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  conversation_id: string;
  created_at: string;
  updated_at: string;
}

// Add to existing interfaces
interface TaskSuggestion {
  title: string;
  description: string;
  columnId: string;
}

export function ChatInterface({
  projectId,
  chatId,
}: {
  projectId: string;
  chatId: string;
}) {
  // const params = useParams();
  // const chatId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    // initialMessages.filter((msg) => msg.chatId === chatId)
    []
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
  // userId={"4fd68587-207a-405f-a405-58fb52001a31"}
  const { addTask } = useBoard(
    projectId,
    "4fd68587-207a-405f-a405-58fb52001a31"
  );
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Handle task suggestion acceptance
  const handleAcceptTasks = async (tasks: TaskSuggestion[]) => {
    try {
      setLoading(true);
      const tasksTitle = [];
      for (const task of tasks) {
        // userId={"4fd68587-207a-405f-a405-58fb52001a31"}
        console.log("TASK: ", task);
        console.log("TASK Column ID: ", task.columnId);
        tasksTitle.push(`- ${task.title}`);
        await addTask(task.columnId, {
          title: task.title,
          description: task.description,
        });
        // await taskTool.invoke({
        //   title: task.title,
        //   description: task.description,
        //   columnId: task.columnId,
        //   projectId,
        // });
      }

      // Add confirmation message
      const { data: confirmMessage, error: confirmError } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatId,
          content: `✅ Successfully created ${
            tasks.length
          } task(s): \n          
            ${tasksTitle.join("\n")}
          `,
          role: "assistant",
        })
        .select()
        .single();

      if (confirmError) throw confirmError;
      setMessages((prev) => [...prev, confirmMessage]);
    } catch (error) {
      console.error("Error creating tasks:", error);
    } finally {
      setTaskSuggestions([]);
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", chatId)
      .order("created_at", { ascending: true });

    if (messages) {
      setMessages(messages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);

    try {
      // Insert user message
      const { data: userMessage, error: userError } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatId,
          content: input,
          role: "user",
        })
        .select()
        .single();

      if (userError) throw userError;

      // Update local state
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          projectId,
          chatId,
        }),
      });

      const data = await response.json();
      console.log("CHAT INTERFACE RESPONSE: ", data);

      // Handle task suggestions if present
      if (data.toolCalls) {
        const tools = data.content;
        console.log("TOOLS: ", tools);
        tools.map((tool: any) => {
          console.log("TOOL: ", tool);
          if (tool.name === "CreateTask") {
            setTaskSuggestions((prev) => {
              const prevSuggestions = prev || [];
              return [
                ...prevSuggestions,
                {
                  title: tool.args.title,
                  description: tool.args.description,
                  columnId: tool.args.column_id,
                  projectId,
                },
              ];
            });
          }
        });
      } else {
        console.log(taskSuggestions);

        // Insert AI message
        const { data: aiMessage, error: aiError } = await supabase
          .from("messages")
          .insert({
            conversation_id: chatId,
            content: data.content,
            role: "assistant",
          })
          .select()
          .single();

        if (aiError) throw aiError;

        // Update local state
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] mx-auto max-w-4xl p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
              )}
            >
              {message.role === "user" ? (
                <div className="prose dark:prose-invert prose-sm">
                  {message.content}
                </div>
              ) : (
                <ReactMarkdown
                  className={cn(
                    "prose dark:prose-invert prose-sm max-w-none",
                    "prose-p:leading-relaxed prose-pre:p-0",
                    "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md",
                    "prose-code:bg-gray-100 dark:prose-code:bg-gray-800"
                  )}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {taskSuggestions.length > 0 && (
          <TaskSuggestion
            suggestions={taskSuggestions}
            onAccept={handleAcceptTasks}
            onReject={() => setTaskSuggestions([])}
          />
        )}
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the project..."
          className="flex-1 p-2 rounded-md border bg-background"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={cn(
            "p-2 rounded-md transition-colors",
            "bg-blue-500 text-white hover:bg-blue-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
