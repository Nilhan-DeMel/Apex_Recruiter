"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Folder, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { listVacancies, createVacancy, deleteVacancy, updateVacancy, VacancyDoc } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { Timestamp } from "firebase/firestore";

interface VacancyListItem extends VacancyDoc {
    id: string;
}

interface VacancyLibraryModalProps {
    onOpenVacancy: (id: string) => void;
    currentVacancyId: string | null;
}

export function VacancyLibraryModal({ onOpenVacancy, currentVacancyId }: VacancyLibraryModalProps) {
    const { uid } = useAuth();
    const [open, setOpen] = useState(false);
    const [vacancies, setVacancies] = useState<VacancyListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadVacancies = async () => {
        if (!uid) return;
        setLoading(true);
        try {
            const list = await listVacancies();
            setVacancies(list);
        } catch (error) {
            console.error("Failed to load vacancies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && uid) {
            loadVacancies();
        }
    }, [open, uid]);

    const handleCreateNew = async () => {
        if (!uid) return;
        setLoading(true);
        try {
            const newId = await createVacancy("New Vacancy");
            await loadVacancies();
            onOpenVacancy(newId);
            setOpen(false);
        } catch (error) {
            console.error("Failed to create vacancy:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (id: string) => {
        onOpenVacancy(id);
        setOpen(false);
    };

    const handleStartEdit = (vacancy: VacancyListItem) => {
        setEditingId(vacancy.id);
        setEditTitle(vacancy.title);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editTitle.trim()) return;
        try {
            await updateVacancy(editingId, { title: editTitle.trim() });
            await loadVacancies();
            setEditingId(null);
            setEditTitle("");
        } catch (error) {
            console.error("Failed to rename vacancy:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    const handleDelete = async (id: string) => {
        if (id === currentVacancyId) {
            alert("Cannot delete the currently open vacancy. Please open a different vacancy first.");
            return;
        }
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteVacancy(deletingId);
            await loadVacancies();
        } catch (error) {
            console.error("Failed to delete vacancy:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return "Unknown";
        try {
            return timestamp.toDate().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "Unknown";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "draft": return "secondary";
            case "analyzing": return "default";
            case "persona_ready": return "default";
            case "approved": return "default";
            default: return "secondary";
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Open Vacancy Library">
                        <Folder className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Vacancy Library</span>
                            <Button size="sm" onClick={handleCreateNew} disabled={loading}>
                                <Plus className="h-4 w-4 mr-1" />
                                New Vacancy
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto min-h-0 mt-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : vacancies.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No saved vacancies yet.</p>
                                <p className="text-sm mt-1">Click &quot;New Vacancy&quot; to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {vacancies.map((vacancy) => (
                                    <div
                                        key={vacancy.id}
                                        className={`p-3 rounded-lg border transition-colors ${currentVacancyId === vacancy.id
                                                ? "bg-primary/10 border-primary/30"
                                                : "bg-card hover:bg-accent/50"
                                            }`}
                                    >
                                        {editingId === vacancy.id ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="h-8"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleSaveEdit();
                                                        if (e.key === "Escape") handleCancelEdit();
                                                    }}
                                                />
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium truncate">{vacancy.title}</span>
                                                        <Badge variant={getStatusColor(vacancy.status)} className="text-xs shrink-0">
                                                            {vacancy.status}
                                                        </Badge>
                                                        {currentVacancyId === vacancy.id && (
                                                            <Badge variant="outline" className="text-xs shrink-0">
                                                                Open
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Updated {formatDate(vacancy.updatedAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleOpen(vacancy.id)}
                                                        disabled={currentVacancyId === vacancy.id}
                                                    >
                                                        Open
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => handleStartEdit(vacancy)}
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(vacancy.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Vacancy?</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                        This will permanently delete the vacancy and all its data (messages, files, notes, personas).
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDeletingId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
