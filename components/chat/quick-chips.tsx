"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QuickChipsProps {
    onSelect: (prompt: string) => void;
}

const quickPrompts = [
    { label: "Summarize requirements", prompt: "Please summarize the key requirements for this role." },
    { label: "Identify must-haves", prompt: "What are the absolute must-have requirements for this role?" },
    { label: "Check for contradictions", prompt: "Are there any contradictions or unclear aspects in the job description?" },
    { label: "Sri Lanka salary range", prompt: "What's a realistic salary range for this role in the Sri Lanka market?" },
    { label: "Generate personas", prompt: "Generate 5 distinct candidate personas for this vacancy." },
    { label: "Make it more senior", prompt: "Adjust the personas to target more senior candidates with 8+ years experience." },
    { label: "Budget-friendly options", prompt: "Generate personas focused on budget-friendly candidates who might accept lower compensation." },
    { label: "Remote-only candidates", prompt: "Focus on candidates who prefer or require remote work arrangements." },
    { label: "Fast joiners", prompt: "Prioritize candidates who could potentially join within 2 weeks notice." },
];

export function QuickChips({ onSelect }: QuickChipsProps) {
    return (
        <div className="border-t border-border px-4 py-2">
            <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                    {quickPrompts.map((item) => (
                        <Button
                            key={item.label}
                            variant="outline"
                            size="sm"
                            className="shrink-0 rounded-full text-xs"
                            onClick={() => onSelect(item.prompt)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
