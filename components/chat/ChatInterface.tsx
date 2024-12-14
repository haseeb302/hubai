"use client";

import { useEffect, useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
// import { initialMessages } from "@/lib/constants";
// import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  conversation_id: string;
  created_at: string;
  updated_at: string;
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

  useEffect(() => {
    loadChatHistory();
  }, []);

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
            className={`flex items-start gap-2 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5 text-blue-500" />
              ) : (
                <Bot className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {message.content}
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the project..."
          className="flex-1 p-2 rounded-md border"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
