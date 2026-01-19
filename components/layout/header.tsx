"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVacancyStore } from "@/lib/store/vacancy-store";
import {
    Key,
    KeyRound,
    Moon,
    MoreVertical,
    Pencil,
    Save,
    Sun,
    Trash2,
    Loader2,
} from "lucide-react";
import { useState } from "react";
import { VacancyLibraryModal } from "@/components/vacancy/vacancy-library-modal";

interface HeaderProps {
    hasApiKey: boolean;
    onClearKey: () => void;
    onSetKey: () => void;
    onOpenVacancy?: (id: string) => void;
    onSaveVacancy?: () => Promise<void>;
    currentVacancyId?: string | null;
    isDirty?: boolean;
    isSaving?: boolean;
}

const statusConfig = {
    draft: { label: "Draft", variant: "secondary" as const },
    analyzing: { label: "Analyzing", variant: "default" as const },
    persona_ready: { label: "Personas Ready", variant: "default" as const },
    approved: { label: "Approved", variant: "default" as const },
};

export function Header({
    hasApiKey,
    onClearKey,
    onSetKey,
    onOpenVacancy,
    onSaveVacancy,
    currentVacancyId,
    isDirty = false,
    isSaving = false,
}: HeaderProps) {
    const { vacancyName, setVacancyName, vacancyStatus, resetAll } = useVacancyStore();
    const [isDark, setIsDark] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    const handleNameClick = () => {
        setIsEditingName(true);
    };

    const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsEditingName(false);
        if (e.target.value.trim()) {
            setVacancyName(e.target.value.trim());
        }
    };

    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        }
        if (e.key === "Escape") {
            setIsEditingName(false);
        }
    };

    const handleSave = async () => {
        if (onSaveVacancy) {
            await onSaveVacancy();
        }
    };

    const status = statusConfig[vacancyStatus];

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-sm">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-lg font-bold">A</span>
                    </div>
                    <span className="hidden text-lg font-semibold text-foreground sm:inline">
                        Apex
                    </span>
                </div>

                <div className="hidden h-6 w-px bg-border sm:block" />

                {/* Vacancy Library Button */}
                {onOpenVacancy && (
                    <VacancyLibraryModal
                        onOpenVacancy={onOpenVacancy}
                        currentVacancyId={currentVacancyId || null}
                    />
                )}

                {/* Vacancy Name */}
                <div className="flex items-center gap-2">
                    {isEditingName ? (
                        <input
                            type="text"
                            defaultValue={vacancyName}
                            onBlur={handleNameBlur}
                            onKeyDown={handleNameKeyDown}
                            autoFocus
                            aria-label="Vacancy name"
                            placeholder="Enter vacancy name"
                            className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    ) : (
                        <button
                            onClick={handleNameClick}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                        >
                            {vacancyName}
                            <Pencil className="h-3 w-3 opacity-50" />
                        </button>
                    )}
                    <Badge variant={status.variant} className="text-xs">
                        {status.label}
                    </Badge>
                    {isDirty && (
                        <span className="h-2 w-2 rounded-full bg-yellow-500" title="Unsaved changes" />
                    )}
                </div>

                {/* Save Button */}
                {onSaveVacancy && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        disabled={isSaving}
                        title={isDirty ? "Save changes" : "All changes saved"}
                        className="h-8 w-8"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className={`h-4 w-4 ${isDirty ? "text-yellow-500" : ""}`} />
                        )}
                    </Button>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* API Key Status */}
                <Button
                    variant={hasApiKey ? "ghost" : "outline"}
                    size="sm"
                    onClick={hasApiKey ? onClearKey : onSetKey}
                    className="hidden sm:flex gap-2"
                >
                    {hasApiKey ? (
                        <>
                            <KeyRound className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-muted-foreground">Key Set</span>
                        </>
                    ) : (
                        <>
                            <Key className="h-4 w-4" />
                            <span>Set API Key</span>
                        </>
                    )}
                </Button>

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {isDark ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                {/* More Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={onSetKey}>
                            <Key className="mr-2 h-4 w-4" />
                            {hasApiKey ? "Change API Key" : "Set API Key"}
                        </DropdownMenuItem>
                        {hasApiKey && (
                            <DropdownMenuItem onClick={onClearKey}>
                                <KeyRound className="mr-2 h-4 w-4" />
                                Clear API Key
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="text-[10px] opacity-70 flex flex-col items-start gap-0.5 px-3 py-2 font-mono bg-muted/30">
                            <span className="font-bold text-primary">Build Info</span>
                            <span className="truncate w-full line-clamp-1">SHA: {process.env.NEXT_PUBLIC_GIT_SHA?.substring(0, 7) || "dev"}</span>
                            <span>Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "unknown"}</span>
                            <span className="truncate w-full line-clamp-1">Host: {typeof window !== 'undefined' ? window.location.host : 'server'}</span>
                            <span>{process.env.NEXT_PUBLIC_BUILD_TIME ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString() : "Dev Mode"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={resetAll} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Reset All
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

