"use client";

import { useState } from "react";
import { useVacancyStore } from "@/lib/store/vacancy-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Edit2, FileText, Save, X } from "lucide-react";

export function ExtractedTextViewer() {
    const { extractedText, setExtractedText, appendExtractedText } = useVacancyStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(extractedText);
    const [copied, setCopied] = useState(false);
    const [isPasting, setIsPasting] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEdit = () => {
        setEditedText(extractedText);
        setIsEditing(true);
    };

    const handleSave = () => {
        setExtractedText(editedText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handlePasteText = () => {
        setIsPasting(true);
    };

    const handlePasteSubmit = (text: string) => {
        if (text.trim()) {
            appendExtractedText(`--- Pasted Text ---\n${text}`);
        }
        setIsPasting(false);
    };

    if (!extractedText && !isPasting) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 font-medium">No text extracted yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Upload a file or paste job description text directly
                </p>
                <Button onClick={handlePasteText} className="mt-4 gap-2">
                    <Edit2 className="h-4 w-4" />
                    Paste Text
                </Button>
            </div>
        );
    }

    if (isPasting) {
        return (
            <div className="flex h-full flex-col p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">Paste Job Description</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsPasting(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Textarea
                    placeholder="Paste the job description text here..."
                    className="flex-1 resize-none"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                            handlePasteSubmit((e.target as HTMLTextAreaElement).value);
                        }
                    }}
                />
                <div className="mt-3 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsPasting(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            const textarea = (e.target as HTMLElement)
                                .closest(".flex-col")
                                ?.querySelector("textarea");
                            if (textarea) handlePasteSubmit(textarea.value);
                        }}
                    >
                        Add Text
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="text-sm font-medium">Extracted Text</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                    {isEditing ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleSave}
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleCancel}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleEdit}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
                {isEditing ? (
                    <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="min-h-[400px] resize-none font-mono text-sm"
                    />
                ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                        {extractedText}
                    </pre>
                )}
            </ScrollArea>

            {/* Add More Button */}
            <div className="border-t border-border p-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handlePasteText}
                >
                    <Edit2 className="h-4 w-4" />
                    Paste Additional Text
                </Button>
            </div>
        </div>
    );
}
