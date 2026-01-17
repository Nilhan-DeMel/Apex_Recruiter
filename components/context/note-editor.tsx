"use client";

import { useState } from "react";
import { useVacancyStore } from "@/lib/store/vacancy-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus, StickyNote, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NoteEditor() {
    const { notes, addNote, removeNote } = useVacancyStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [newNote, setNewNote] = useState("");

    const handleAddNote = () => {
        if (newNote.trim()) {
            addNote(newNote.trim());
            setNewNote("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleAddNote();
        }
    };

    return (
        <div className="bg-card/50">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Notes</span>
                    {notes.length > 0 && (
                        <span className="text-xs text-muted-foreground">({notes.length})</span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
            </button>

            {/* Content */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-96" : "max-h-0"
                )}
            >
                <div className="space-y-3 p-4 pt-0">
                    {/* Existing Notes */}
                    {notes.length > 0 && (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="group flex items-start gap-2 rounded-lg bg-muted/50 p-2 text-sm"
                                >
                                    <p className="flex-1 text-muted-foreground whitespace-pre-wrap">
                                        {note.content}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeNote(note.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Note */}
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Add a note about this vacancy..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-h-[60px] resize-none text-sm"
                            rows={2}
                        />
                        <Button
                            onClick={handleAddNote}
                            size="icon"
                            className="shrink-0"
                            disabled={!newNote.trim()}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Press <kbd className="rounded bg-muted px-1">Ctrl+Enter</kbd> to add
                    </p>
                </div>
            </div>
        </div>
    );
}
