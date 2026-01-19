"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Key, MessageSquare, Sparkles, Upload } from "lucide-react";

interface EmptyStateProps {
    hasApiKey: boolean;
    onUpload?: () => void;
    onPaste?: () => void;
    onDescribe?: () => void;
}

export function EmptyState({ hasApiKey, onUpload, onPaste, onDescribe }: EmptyStateProps) {
    return (
        <div className="flex flex-1 w-full items-center justify-center p-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>

                <h2 className="mb-2 text-xl font-semibold">
                    {hasApiKey ? "Start Analyzing a Vacancy" : "Welcome to Apex Recruiter"}
                </h2>

                <p className="mb-6 text-muted-foreground">
                    {hasApiKey
                        ? "Upload a job description or paste the vacancy text to begin the AI-powered analysis."
                        : "Set your OpenAI API key to unlock intelligent vacancy analysis and candidate persona generation."}
                </p>

                {hasApiKey ? (
                    <div className="grid gap-3 text-left">
                        <Card
                            className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={onUpload}
                            role="button"
                            tabIndex={0}
                            data-testid="cta-upload"
                            onKeyDown={(e) => e.key === "Enter" && onUpload?.()}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Upload a file</p>
                                <p className="text-sm text-muted-foreground">
                                    PDF, DOCX, or image of the job description
                                </p>
                            </div>
                        </Card>

                        <Card
                            className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={onPaste}
                            role="button"
                            tabIndex={0}
                            data-testid="cta-paste"
                            onKeyDown={(e) => e.key === "Enter" && onPaste?.()}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Paste text directly</p>
                                <p className="text-sm text-muted-foreground">
                                    Copy and paste the job description text
                                </p>
                            </div>
                        </Card>

                        <Card
                            className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={onDescribe}
                            role="button"
                            tabIndex={0}
                            data-testid="cta-describe"
                            onKeyDown={(e) => e.key === "Enter" && onDescribe?.()}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Describe the role</p>
                                <p className="text-sm text-muted-foreground">
                                    Tell the AI about the vacancy in your own words
                                </p>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Click &quot;Set API Key&quot; in the header to get started
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
