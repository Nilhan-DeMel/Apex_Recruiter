"use client";

import { useVacancyStore, Message } from "@/lib/store/vacancy-store";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    const { messages, addMessage, updateMessage, setMessageStreaming, apiKey, extractedText } = useVacancyStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!apiKey || !content.trim()) return;

        // Add user message
        addMessage({ role: "user", content });

        // Add placeholder assistant message
        const assistantMessageId = Date.now().toString();
        addMessage({ role: "assistant", content: "", isStreaming: true });

        setIsLoading(true);

        try {
            // Prepare context
            const context = extractedText ? `\n\nVacancy Context:\n${extractedText}` : "";
            const systemPrompt = getSystemPrompt();

            // Send to API with streaming
            await sendChatMessage({
                apiKey,
                messages: [
                    { role: "system", content: systemPrompt + context },
                    ...messages.map((m) => ({ role: m.role, content: m.content })),
                    { role: "user", content },
                ],
                onToken: (token) => {
                    // Find the last assistant message and update it
                    const lastMessage = useVacancyStore.getState().messages.slice(-1)[0];
                    if (lastMessage && lastMessage.role === "assistant") {
                        updateMessage(lastMessage.id, lastMessage.content + token);
                    }
                },
                onComplete: () => {
                    const lastMessage = useVacancyStore.getState().messages.slice(-1)[0];
                    if (lastMessage) {
                        setMessageStreaming(lastMessage.id, false);
                    }
                    setIsLoading(false);
                },
                onError: (error) => {
                    const lastMessage = useVacancyStore.getState().messages.slice(-1)[0];
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
        // Find last user message and resend
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
        if (lastUserMessage) {
            handleSendMessage(lastUserMessage.content);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <EmptyState hasApiKey={hasApiKey} />
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
            </ScrollArea>

            {/* Quick Chips */}
            {messages.length > 0 && !isLoading && (
                <QuickChips onSelect={handleQuickChip} />
            )}

            {/* Composer */}
            <ChatComposer
                onSend={handleSendMessage}
                disabled={!hasApiKey || isLoading}
                isLoading={isLoading}
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
