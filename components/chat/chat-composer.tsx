"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Paperclip, Send, Sparkles } from "lucide-react";
import { useRef, useState, KeyboardEvent } from "react";

interface ChatComposerProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatComposer({ onSend, disabled, isLoading, inputRef }: ChatComposerProps) {
    const [message, setMessage] = useState("");
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = inputRef || internalRef;

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    };

    return (
        <div className="border-t border-border bg-card/50 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl">
                <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                    {/* Attachment Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 shrink-0"
                                    disabled={disabled}
                                >
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Attach file</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Textarea */}
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            disabled
                                ? "Set your API key to start chatting..."
                                : "Describe the vacancy or ask a question..."
                        }
                        disabled={disabled}
                        className="min-h-[40px] max-h-[200px] flex-1 resize-none border-0 bg-transparent p-2 text-sm focus-visible:ring-0 scrollbar-thin"
                        rows={1}
                    />

                    {/* Action Buttons */}
                    <div className="flex shrink-0 items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        disabled={disabled}
                                        onClick={() => onSend("Generate candidate personas based on the vacancy analysis so far.")}
                                    >
                                        <Sparkles className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Generate Personas</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            size="icon"
                            className="h-9 w-9"
                            disabled={disabled || !message.trim() || isLoading}
                            onClick={handleSend}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Hint */}
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to send,{" "}
                    <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
