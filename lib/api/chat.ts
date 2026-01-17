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
}: SendChatMessageParams): Promise<void> {
    try {
        // Call OpenAI directly from client (key is already client-side)
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages,
                stream: true,
                temperature: 0.7,
                max_tokens: 4096,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "OpenAI API error");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let done = false;
        let buffer = "";

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                buffer += decoder.decode(value, { stream: true });

                // Parse SSE format
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                            done = true;
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const token = parsed.choices?.[0]?.delta?.content;
                            if (token) {
                                onToken(token);
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        }

        onComplete();
    } catch (error) {
        onError(error instanceof Error ? error : new Error("Unknown error"));
    }
}
