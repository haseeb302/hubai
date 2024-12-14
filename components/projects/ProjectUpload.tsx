"use client";

import { useState } from "react";
import { Upload, File, Loader2 } from "lucide-react";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { supabase } from "@/lib/supabase";
import { sanitizeText } from "@/lib/utils";

interface ProjectUploadProps {
  userId: string;
}

export function ProjectUpload({ userId }: ProjectUploadProps) {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !files) return;

    setLoading(true);
    try {
      console.log("userID:", userId);
      // 1. Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: projectName,
          description: projectDescription,
          created_by: userId,
          company_id: "decdb8b3-f1ca-4964-9543-5b166d0e33ba",
        })
        .select()
        .single();

      console.log("PROJECT: ", project);

      if (projectError) throw projectError;

      // 2. Process each file
      for (const file of Array.from(files)) {
        if (!["application/pdf", "text/plain"].includes(file.type)) {
          console.warn(
            `Skipping file ${file.name}: unsupported type ${file.type}`
          );
          continue;
        }

        const chunks = await processFile(file);

        console.log("CHUNKS: ", chunks);

        // 3. Create embeddings and store in Supabase
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
          console.log("SANITISED CHUNKS: ", sanitizedChunks);
          // Get the actual embeddings for the chunks
          const vectors = await embeddings.embedDocuments(sanitizedChunks);

          console.log(`Vector ${i}`, vectors);

          // Create metadata for each chunk
          const documents = sanitizedChunks.map(
            (chunk: string, idx: number) => ({
              content: chunk,
              metadata: {
                source: file.name,
                projectId: project.id,
                chunkIndex: i + idx,
              },
              embedding: vectors[idx],
            })
          );

          // Store in Supabase with the embeddings
          const response = await supabase.from("documents").insert(
            documents.map((doc: any) => ({
              content: doc.content,
              metadata: doc.metadata,
              embedding: doc.embedding,
              created_by: userId,
              name: projectName,
              project_id: project.id,
            }))
          );

          console.log("Response", response);
        }
        // await SupabaseVectorStore.fromTexts(
        //   chunks,
        //   { source: file.name, projectId: project.id },
        //   embeddings,
        //   {
        //     client: supabase,
        //     tableName: "documents",
        //     queryName: "match_documents",
        //   }
        // );
      }

      // Reset form
      setProjectName("");
      setProjectDescription("");
      setFiles(null);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Project Documents</label>
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <input
            type="file"
            multiple
            accept=".txt,.pdf"
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload project documents
            </span>
          </label>
        </div>
        {files && (
          <div className="mt-4 space-y-2">
            {Array.from(files).map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <File className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : (
          "Create Project"
        )}
      </button>
    </form>
  );
}
