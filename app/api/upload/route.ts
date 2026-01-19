import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
    try {
        // Dynamic import to avoid Turbopack dependency issues at build time
        const pdf = await import("pdf-parse");
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
        const existingVectorStoreId = formData.get("vectorStoreId") as string | null;

        if (!file || !apiKey) {
            return NextResponse.json({ error: "Missing file or API key" }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey });
        const buffer = Buffer.from(await file.arrayBuffer());

        let extractedText = "";

        // 1. Local Extraction (Strategy 2 - Fallback/Sync)
        try {
            if (file.type === "application/pdf") {
                // @ts-expect-error: pdf-parse import can be tricky in ESM/CJS mixed env
                const pdfParser = (pdf.default || pdf);
                const data = await pdfParser(buffer);
                extractedText = data.text;
            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ buffer });
                extractedText = result.value;
            } else if (file.type === "text/plain") {
                extractedText = buffer.toString("utf-8");
            }
        } catch (e) {
            console.error("Local extraction failed:", e);
        }

        // 2. OpenAI Upload & Vector Store (Strategy 1 - Primary)
        // We upload the file to OpenAI for 'assistants' purpose
        const openaiFile = await openai.files.create({
            file: new File([buffer], file.name, { type: file.type }),
            purpose: "assistants",
        });

        // Create a vector store if you want a dedicated one, 
        let vectorStoreId = existingVectorStoreId;
        if (!vectorStoreId) {
            const vectorStore = await openai.vectorStores.create({
                name: `Vacancy Context: ${file.name}`,
            });
            vectorStoreId = vectorStore.id;
        }

        // Add file to vector store
        const vectorStoreFile = await openai.vectorStores.files.create(vectorStoreId, {
            file_id: openaiFile.id,
        });

        // CRITICAL: Wait for the file to be fully processed by OpenAI
        // The AI cannot search the file until it's indexed
        console.log(`Waiting for file ${file.name} to be indexed in vector store...`);
        let fileStatus = vectorStoreFile.status;
        let pollCount = 0;
        const maxPolls = 60; // 60 seconds max wait

        while (fileStatus === "in_progress" && pollCount < maxPolls) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fileCheck = await openai.vectorStores.files.retrieve(openaiFile.id, { vector_store_id: vectorStoreId });
            fileStatus = fileCheck.status;
            pollCount++;
            console.log(`File status: ${fileStatus} (poll ${pollCount}/${maxPolls})`);
        }

        if (fileStatus !== "completed") {
            console.error(`File processing did not complete. Final status: ${fileStatus}`);
            return NextResponse.json({
                error: `File upload succeeded but indexing failed with status: ${fileStatus}`,
                openaiFileId: openaiFile.id,
                vectorStoreId: vectorStoreId,
            }, { status: 500 });
        }

        console.log(`✓ File ${file.name} successfully indexed and ready for search`);

        return NextResponse.json({
            success: true,
            openaiFileId: openaiFile.id,
            vectorStoreId: vectorStoreId,
            extractedText: extractedText || `[Content of ${file.name}]`,
            status: "ready"
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Upload route error:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
