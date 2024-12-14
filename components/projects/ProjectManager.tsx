"use client";
import { useState } from "react";
import { Upload, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { sanitizeText } from "@/lib/utils";

interface ProjectManagerProps {
  projectId: string;
  projectName: string;
  userId: string;
}

export function ProjectManager({
  projectId,
  projectName,
  userId,
}: ProjectManagerProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/process-file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process file");
    }

    const { chunks } = await response.json();
    return chunks;
  };

  const handleFileUpload = async () => {
    if (!files) return;
    setLoading(true);

    try {
      for (const file of Array.from(files)) {
        if (!["application/pdf", "text/plain"].includes(file.type)) {
          console.warn(
            `Skipping file ${file.name}: unsupported type ${file.type}`
          );
          continue;
        }

        // Process file using the same API endpoint as ProjectUpload
        const chunks = await processFile(file);
        console.log("CHUNKS: ", chunks);

        // Create embeddings
        const embeddings = new OpenAIEmbeddings({
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        });

        // Process chunks in smaller batches
        const batchSize = 250;
        for (let i = 0; i < chunks.length; i += batchSize) {
          const batchChunks = chunks.slice(i, i + batchSize);

          const sanitizedChunks = batchChunks.map((chunk: string) =>
            sanitizeText(chunk)
          );

          // Get embeddings for the chunks
          const vectors = await embeddings.embedDocuments(sanitizedChunks);

          // Create documents with metadata
          const documents = sanitizedChunks.map(
            (chunk: string, idx: number) => ({
              content: chunk,
              metadata: {
                source: file.name,
                projectId: projectId,
                chunkIndex: i + idx,
              },
              embedding: vectors[idx],
              project_id: projectId,
              name: projectName,
              created_by: userId,
            })
          );

          // Store in Supabase
          const { error } = await supabase.from("documents").insert(documents);

          if (error) throw error;
        }
      }
      setFiles(null);
      alert("Files processed and added to project successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error processing files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setLoading(true);

    try {
      const sanitizedText = sanitizeText(textInput);
      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      const vector = await embeddings.embedQuery(sanitizedText);

      await supabase.from("documents").insert({
        content: sanitizedText,
        metadata: {
          source: "manual_input",
          projectId: projectId,
        },
        embedding: vector,
        project_id: projectId,
        name: projectName,
        created_by: userId,
      });

      setTextInput("");
      alert("Text added to project successfully!");
    } catch (error) {
      console.error("Error adding text:", error);
      alert("Error adding text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-extrabold">Add Context - {projectName}</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Add Files</label>
        <input
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm"
        />
        <button
          onClick={handleFileUpload}
          disabled={!files || loading}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span className="ml-2">Upload Files</span>
        </button>
      </div>

      <div className="flex flex-row items-center justify-center">
        <div className="border w-40 h-0" />
        <h1 className="text-2xl font-extrabold mx-5">OR</h1>
        <div className="border w-40 h-0" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Add Text</label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={8}
          placeholder="Enter additional context..."
        />
        <button
          onClick={handleTextSubmit}
          disabled={!textInput.trim() || loading}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="ml-2">Add Text</span>
        </button>
      </div>
    </div>
  );
}
