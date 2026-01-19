interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface SendChatMessageParams {
    apiKey: string;
    messages: ChatMessage[];
    onToken: (token: string) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
}

export async function sendChatMessage({
    apiKey,
    messages,
    onToken,
    onComplete,
    onError,
    vectorStoreId,
    threadId,
    onThreadId,
}: SendChatMessageParams & {
    vectorStoreId?: string,
    threadId?: string | null,
    onThreadId?: (id: string) => void
}): Promise<void> {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages,
                vectorStoreId,
                threadId
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Proxy API error");
        }

        const data = await response.json();

        if (data.threadId && onThreadId) {
            onThreadId(data.threadId);
        }

        if (data.content) {
            // Since proxy is currently non-streaming, we send the whole content at once
            onToken(data.content);
        }

        onComplete();
    } catch (error) {
        onError(error instanceof Error ? error : new Error("Unknown error"));
    }
}
