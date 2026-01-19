"use client";

import { useVacancyStore } from "@/lib/store/vacancy-store";
import { ChatMessage } from "./chat-message";
import { ChatComposer } from "./chat-composer";
import { QuickChips } from "./quick-chips";
import { EmptyState } from "./empty-state";
import { useRef, useEffect, useState } from "react";
import { sendChatMessage } from "@/lib/api/chat";

interface ChatPanelProps {
    hasApiKey: boolean;
}

export function ChatPanel({ hasApiKey }: ChatPanelProps) {
    const {
        messages, addMessage, updateMessage, setMessageStreaming,
        extractedText, setActiveTab, addFile,
        threadId, setThreadId, files, apiKey
    } = useVacancyStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const composerRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!apiKey || !content.trim()) return;

        // Add user message to local store
        addMessage({ role: "user", content });

        // Persist to Firestore
        try {
            const vacancyId = useVacancyStore.getState().vacancyId;
            if (vacancyId) {
                const { addMessage: firestoreAddMessage } = await import("@/lib/firebase/firestore");
                await firestoreAddMessage(vacancyId, {
                    role: "user",
                    content
                });
            }
        } catch (err) {
            console.error("[ChatPanel] Failed to persist user message:", err);
        }

        try {
            // Prepare assistant placeholder and message
            addMessage({ role: "assistant", content: "", isStreaming: true });
            setIsLoading(true);

            // Prepare context
            const context = extractedText ? `\n\nVacancy Context:\n${extractedText}` : "";
            const systemPrompt = getSystemPrompt();
            const vectorStoreId = files[0]?.vectorStoreId;

            // Send to API with streaming
            await sendChatMessage({
                apiKey,
                vectorStoreId,
                threadId,
                onThreadId: (id) => setThreadId(id),
                messages: [
                    { role: "system", content: systemPrompt + context },
                    ...useVacancyStore.getState().messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
                    { role: "user", content },
                ],
                onToken: (token) => {
                    const latestMessages = useVacancyStore.getState().messages;
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    if (lastMessage && lastMessage.role === "assistant") {
                        updateMessage(lastMessage.id, lastMessage.content + token);
                    }
                },
                onComplete: () => {
                    const latestMessages = useVacancyStore.getState().messages;
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    if (lastMessage) {
                        setMessageStreaming(lastMessage.id, false);
                    }
                    setIsLoading(false);
                },
                onError: (error) => {
                    const latestMessages = useVacancyStore.getState().messages;
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    if (lastMessage) {
                        updateMessage(lastMessage.id, `Error: ${error.message}`);
                        setMessageStreaming(lastMessage.id, false);
                    }
                    setIsLoading(false);
                },
            });
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleQuickChip = (prompt: string) => {
        handleSendMessage(prompt);
    };

    const handleRegenerate = () => {
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
        if (lastUserMessage) {
            handleSendMessage(lastUserMessage.content);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !apiKey) return;

        addFile({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            status: "uploading"
        });
        setActiveTab("files");

        try {
            const formData = new FormData();
            formData.append("file", file);
            if (files[0]?.vectorStoreId) {
                formData.append("vectorStoreId", files[0].vectorStoreId);
            }

            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            useVacancyStore.setState((state) => ({
                files: state.files.map((f) =>
                    f.name === file.name ? { ...f, ...data, status: "ready" } : f
                ),
                extractedText: data.extractedText || state.extractedText
            }));
        } catch (error) {
            useVacancyStore.setState((state) => ({
                files: state.files.map((f) =>
                    f.name === file.name ? { ...f, status: "error" } : f
                )
            }));
        }
    };

    const handlePasteClick = () => {
        setActiveTab("text");
        composerRef.current?.focus();
    };

    const handleDescribeClick = () => {
        composerRef.current?.focus();
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col flex-1 overflow-y-auto p-4 min-h-0" ref={scrollRef}>
                {messages.length === 0 ? (
                    <EmptyState
                        hasApiKey={hasApiKey}
                        onUpload={handleUploadClick}
                        onPaste={handlePasteClick}
                        onDescribe={handleDescribeClick}
                    />
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                onRegenerate={message.role === "assistant" ? handleRegenerate : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>

            {messages.length > 0 && !isLoading && (
                <QuickChips onSelect={handleQuickChip} />
            )}

            <div className="shrink-0 z-10 w-full relative">
                <ChatComposer
                    onSend={handleSendMessage}
                    disabled={!hasApiKey || isLoading}
                    isLoading={isLoading}
                    inputRef={composerRef}
                />
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.txt,.jpg,.png"
            />
        </div>
    );
}

function getSystemPrompt(): string {
    return `You are an expert recruitment consultant specializing in the Sri Lankan job market. You help recruiters analyze job vacancies and generate ideal candidate personas.

Your role is to:
1. Analyze job descriptions thoroughly
2. Ask clarifying questions to resolve ambiguities
3. Identify must-have vs nice-to-have requirements
4. Detect contradictions and help resolve them
5. Consider Sri Lanka market specifics (salary ranges, notice periods, typical employers)

When analyzing a vacancy, guide the conversation through these stages:
- Role Summary: Confirm your understanding of the position
- Requirements Analysis: Separate must-haves from nice-to-haves
- Scope Calibration: Determine IC vs lead vs manager level
- Logistics: Cover compensation, notice period, location, remote options
- Dealbreakers: Identify absolute requirements
- Sri Lanka Context: Consider local market factors

Be conversational but structured. Ask one clarifying question at a time when needed.

When the user asks you to generate personas, create 3-7 distinct candidate scenarios each with:
- Headline (1 line)
- Summary
- Core skills
- Domain experience
- Typical employers (Sri Lanka-relevant categories, not specific companies)
- Salary band hypothesis (LKR, flagged as estimate)
- Notice period assumption
- Red flags/risks
- Outreach angle
- Boolean search strings for Google/LinkedIn X-ray (manual use only)

Output persona data in a clear, structured format.`;
}
