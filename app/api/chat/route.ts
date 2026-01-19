import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
    try {
        const { messages, vectorStoreId, threadId: existingThreadId } = await req.json();
        const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API key" }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey });

        // 1. Ensure we have an Assistant with file_search
        // In a real app, we'd reuse one, but here we create/manage for the session
        const assistant = await openai.beta.assistants.create({
            name: "Apex Recruiter Assistant",
            instructions: "You are a professional recruiter. Use the provided files to answer questions. Always reference filenames. If file_search finds no relevant info, mention that but don't say you can't access files generally.",
            model: "gpt-4o",
            tools: [{ type: "file_search" }],
            tool_resources: vectorStoreId ? {
                file_search: {
                    vector_store_ids: [vectorStoreId]
                }
            } : undefined
        });

        // 2. Get or Create Thread
        let threadId = existingThreadId;
        if (!threadId) {
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
        }

        // 3. Add the latest user message to the thread
        const lastMessage = messages[messages.length - 1];
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: lastMessage.content,
        });

        // 4. Run the assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistant.id,
        });

        // 5. Poll for completion (simplified for proxy)
        let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId });
        while (runStatus.status === "queued" || runStatus.status === "in_progress") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId });
        }

        if (runStatus.status === "completed") {
            const threadMessages = await openai.beta.threads.messages.list(threadId);
            const assistantResponse = threadMessages.data.find(m => m.role === "assistant");
            const content = assistantResponse?.content[0];

            let text = "";
            if (content?.type === "text") {
                text = content.text.value;
                // Basic cleanup of citations like [1]
                text = text.replace(/【.*?】/g, "");
            }

            return NextResponse.json({
                content: text,
                threadId: threadId,
                status: "success"
            });
        } else {
            return NextResponse.json({ error: `Run failed with status: ${runStatus.status}` }, { status: 500 });
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Chat route error:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
