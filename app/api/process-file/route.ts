import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { sanitizeText } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    let text = "";
    let chunks = [];

    if (file.type === "application/pdf") {
      // Handle PDF files using LangChain's PDFLoader
      const loader = new PDFLoader(tempPath);
      const docs = await loader.load();
      text = docs.map((doc) => sanitizeText(doc.pageContent)).join("\n");
      console.log("PDF: ", text);
    } else if (file.type === "text/plain") {
      // Handle text files
      text = sanitizeText(buffer.toString());
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    chunks = await splitter.splitText(text);

    const sanitizedChunks = chunks.map((chunk) => sanitizeText(chunk));

    return NextResponse.json({ chunks: sanitizedChunks });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
