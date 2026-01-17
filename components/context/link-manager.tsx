"use client";

import { useState } from "react";
import { useVacancyStore } from "@/lib/store/vacancy-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ExternalLink, Link, Plus, Trash2 } from "lucide-react";

export function LinkManager() {
    const { links, addLink, removeLink } = useVacancyStore();
    const [newUrl, setNewUrl] = useState("");
    const [error, setError] = useState("");

    const handleAddLink = () => {
        if (!newUrl.trim()) {
            setError("Please enter a URL");
            return;
        }

        try {
            const url = new URL(newUrl.startsWith("http") ? newUrl : `https://${newUrl}`);
            addLink({
                url: url.href,
                title: url.hostname,
            });
            setNewUrl("");
            setError("");
        } catch {
            setError("Please enter a valid URL");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddLink();
        }
    };

    return (
        <div className="space-y-4">
            {/* Add Link Form */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        placeholder="Paste a link (e.g., job posting URL)..."
                        value={newUrl}
                        onChange={(e) => {
                            setNewUrl(e.target.value);
                            setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                    />
                    <Button onClick={handleAddLink} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {/* Link List */}
            {links.length > 0 ? (
                <div className="space-y-2">
                    {links.map((link) => (
                        <Card key={link.id} className="flex items-center gap-3 p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Link className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {link.title || link.url}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {link.url}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => window.open(link.url, "_blank")}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeLink(link.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Link className="h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">No links added yet</p>
                    <p className="text-xs text-muted-foreground">
                        Add job posting URLs or related resources
                    </p>
                </div>
            )}
        </div>
    );
}
