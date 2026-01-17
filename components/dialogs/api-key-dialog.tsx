"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";

interface ApiKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (key: string) => void;
}

export function ApiKeyDialog({ open, onOpenChange, onSubmit }: ApiKeyDialogProps) {
    const [key, setKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!key.trim()) {
            setError("Please enter an API key");
            return;
        }
        if (!key.startsWith("sk-")) {
            setError("Invalid API key format (should start with 'sk-')");
            return;
        }
        onSubmit(key.trim());
        setKey("");
        setError("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        OpenAI API Key
                    </DialogTitle>
                    <DialogDescription>
                        Enter your OpenAI API key to enable AI-powered vacancy analysis.
                        Your key is stored only in browser memory and never saved to our servers.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Input
                            type={showKey ? "text" : "password"}
                            placeholder="sk-..."
                            value={key}
                            onChange={(e) => {
                                setKey(e.target.value);
                                setError("");
                            }}
                            onKeyDown={handleKeyDown}
                            className="pr-10 font-mono"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showKey ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">Security Notice</p>
                        <ul className="mt-1 space-y-1">
                            <li>• Key is stored in sessionStorage (cleared on tab close)</li>
                            <li>• Key is sent via HTTPS to our secure proxy</li>
                            <li>• Key is never logged or persisted</li>
                            <li>• You can clear it anytime from the header menu</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!key.trim()}>
                        Save Key
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
