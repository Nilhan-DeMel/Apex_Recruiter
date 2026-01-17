"use client";

import { Message } from "@/lib/store/vacancy-store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, Check, Copy, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
    message: Message;
    onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
    const [copied, setCopied] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isUser = message.role === "user";
    const isAssistant = message.role === "assistant";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div
            className={cn(
                "group flex gap-3",
                isUser && "flex-row-reverse"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Avatar */}
            <Avatar className={cn(
                "h-8 w-8 shrink-0",
                isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}>
                <div className="flex h-full w-full items-center justify-center">
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
            </Avatar>

            {/* Message Content */}
            <div className={cn("flex max-w-[80%] flex-col gap-1", isUser && "items-end")}>
                <Card
                    className={cn(
                        "px-4 py-3",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-card"
                    )}
                >
                    {message.isStreaming && !message.content ? (
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-current animation-delay-150" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-current animation-delay-300" />
                        </div>
                    ) : (
                        <div className={cn(
                            "prose prose-sm max-w-none",
                            isUser ? "prose-invert" : "dark:prose-invert"
                        )}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Custom styling for markdown elements
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    code: ({ children, className }) => {
                                        const isInline = !className;
                                        return isInline ? (
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                {children}
                                            </code>
                                        ) : (
                                            <code className="block rounded-lg bg-muted p-3 font-mono text-xs overflow-x-auto">
                                                {children}
                                            </code>
                                        );
                                    },
                                    table: ({ children }) => (
                                        <div className="my-2 overflow-x-auto rounded-lg border">
                                            <table className="w-full text-sm">{children}</table>
                                        </div>
                                    ),
                                    th: ({ children }) => (
                                        <th className="border-b bg-muted px-3 py-2 text-left font-medium">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="border-b px-3 py-2">{children}</td>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                            {message.isStreaming && (
                                <span className="typing-cursor" />
                            )}
                        </div>
                    )}
                </Card>

                {/* Timestamp & Actions */}
                <div className={cn(
                    "flex items-center gap-2 px-1 text-xs text-muted-foreground transition-opacity",
                    showActions ? "opacity-100" : "opacity-0"
                )}>
                    <span>{formatTime(message.timestamp)}</span>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </Button>

                    {isAssistant && onRegenerate && !message.isStreaming && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={onRegenerate}
                        >
                            <RefreshCw className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
