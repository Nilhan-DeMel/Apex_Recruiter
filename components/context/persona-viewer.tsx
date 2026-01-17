"use client";

import { useVacancyStore, CandidatePersona, PersonaSet } from "@/lib/store/vacancy-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Check,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    FileJson,
    FileText,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { exportToPDF, exportToDOCX, exportToJSON } from "@/lib/export";

const personaTypeLabels: Record<string, { label: string; color: string }> = {
    safe_fit: { label: "Safe Fit", color: "bg-green-500/20 text-green-400" },
    stretch_fit: { label: "Stretch Fit", color: "bg-blue-500/20 text-blue-400" },
    high_potential: { label: "High Potential", color: "bg-purple-500/20 text-purple-400" },
    budget_fit: { label: "Budget Fit", color: "bg-yellow-500/20 text-yellow-400" },
    fast_joiner: { label: "Fast Joiner", color: "bg-orange-500/20 text-orange-400" },
    niche_specialist: { label: "Niche Specialist", color: "bg-pink-500/20 text-pink-400" },
    custom: { label: "Custom", color: "bg-gray-500/20 text-gray-400" },
};

export function PersonaViewer() {
    const { personaSets, togglePersonaApproval, vacancyName } = useVacancyStore();
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

    const currentSet = selectedVersion
        ? personaSets.find((s) => s.id === selectedVersion)
        : personaSets[personaSets.length - 1];

    if (personaSets.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 font-medium">No personas generated yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Complete the vacancy analysis and ask the AI to generate candidate personas
                </p>
            </div>
        );
    }

    const handleExportPDF = () => {
        if (currentSet) {
            exportToPDF(vacancyName, currentSet.personas);
        }
    };

    const handleExportDOCX = () => {
        if (currentSet) {
            exportToDOCX(vacancyName, currentSet.personas);
        }
    };

    const handleExportJSON = () => {
        if (currentSet) {
            exportToJSON(vacancyName, currentSet.personas);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Personas</span>
                    {personaSets.length > 1 && (
                        <Select
                            value={currentSet?.id}
                            onValueChange={setSelectedVersion}
                        >
                            <SelectTrigger className="h-8 w-24">
                                <SelectValue placeholder="Version" />
                            </SelectTrigger>
                            <SelectContent>
                                {personaSets.map((set) => (
                                    <SelectItem key={set.id} value={set.id}>
                                        v{set.version}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleExportPDF}
                        title="Export PDF"
                    >
                        <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleExportDOCX}
                        title="Export DOCX"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleExportJSON}
                        title="Export JSON"
                    >
                        <FileJson className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Persona Cards */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {currentSet?.personas.map((persona) => (
                        <PersonaCard
                            key={persona.id}
                            persona={persona}
                            setId={currentSet.id}
                            isExpanded={expandedPersona === persona.id}
                            onToggleExpand={() =>
                                setExpandedPersona(
                                    expandedPersona === persona.id ? null : persona.id
                                )
                            }
                            onToggleApproval={() =>
                                togglePersonaApproval(currentSet.id, persona.id)
                            }
                        />
                    ))}
                </div>
            </ScrollArea>

            {/* Summary */}
            <div className="border-t border-border px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        {currentSet?.personas.filter((p) => p.approved).length || 0} of{" "}
                        {currentSet?.personas.length || 0} approved
                    </span>
                    <Button size="sm" variant="outline" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approve All
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface PersonaCardProps {
    persona: CandidatePersona;
    setId: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onToggleApproval: () => void;
}

function PersonaCard({
    persona,
    setId,
    isExpanded,
    onToggleExpand,
    onToggleApproval,
}: PersonaCardProps) {
    const typeConfig = personaTypeLabels[persona.type] || personaTypeLabels.custom;

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div
                className="flex cursor-pointer items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
                onClick={onToggleExpand}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleApproval();
                    }}
                    className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        persona.approved
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-muted-foreground hover:border-primary"
                    )}
                >
                    {persona.approved && <Check className="h-3 w-3" />}
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", typeConfig.color)}>
                            {typeConfig.label}
                        </Badge>
                    </div>
                    <p className="mt-1 font-medium truncate">{persona.headline}</p>
                </div>

                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Summary
                        </h4>
                        <p className="text-sm">{persona.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                                Core Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {persona.coreSkills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                                Salary Band
                            </h4>
                            <p className="text-sm">
                                {persona.salaryBand.currency} {persona.salaryBand.min.toLocaleString()} -{" "}
                                {persona.salaryBand.max.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                                {persona.salaryBand.note}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Typical Employers
                        </h4>
                        <p className="text-sm">{persona.typicalEmployers.join(", ")}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Notice Period
                        </h4>
                        <p className="text-sm">{persona.noticePeriod}</p>
                    </div>

                    {persona.redFlags.length > 0 && (
                        <div>
                            <h4 className="text-xs font-medium text-destructive uppercase mb-1">
                                Red Flags / Risks
                            </h4>
                            <ul className="text-sm list-disc pl-4 text-muted-foreground">
                                {persona.redFlags.map((flag, i) => (
                                    <li key={i}>{flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Outreach Angle
                        </h4>
                        <p className="text-sm italic">{persona.outreachAngle}</p>
                    </div>

                    {persona.booleanSearchStrings.length > 0 && (
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                                Boolean Search Strings
                            </h4>
                            <div className="space-y-1">
                                {persona.booleanSearchStrings.map((str, i) => (
                                    <code
                                        key={i}
                                        className="block text-xs bg-muted p-2 rounded overflow-x-auto"
                                    >
                                        {str}
                                    </code>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
