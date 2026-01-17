"use client";

import { useVacancyStore } from "@/lib/store/vacancy-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "./file-uploader";
import { LinkManager } from "./link-manager";
import { NoteEditor } from "./note-editor";
import { ExtractedTextViewer } from "./extracted-text-viewer";
import { PersonaViewer } from "./persona-viewer";
import { FileText, Link, StickyNote, Users, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ContextPanel() {
    const { files, links, notes, extractedText, personaSets } = useVacancyStore();
    const latestPersonaSet = personaSets[personaSets.length - 1];

    return (
        <div className="flex h-full flex-col bg-card/30">
            {/* Header */}
            <div className="border-b border-border px-4 py-3">
                <h2 className="font-semibold">Vacancy Context</h2>
                <p className="text-sm text-muted-foreground">
                    Upload files, add links, and review extracted information
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="files" className="flex flex-1 flex-col overflow-hidden">
                <TabsList className="mx-4 mt-3 grid w-auto grid-cols-4 gap-1">
                    <TabsTrigger value="files" className="gap-1.5 text-xs">
                        <Upload className="h-3.5 w-3.5" />
                        Files
                        {files.length > 0 && (
                            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                {files.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="links" className="gap-1.5 text-xs">
                        <Link className="h-3.5 w-3.5" />
                        Links
                        {links.length > 0 && (
                            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                {links.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="text" className="gap-1.5 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        Text
                    </TabsTrigger>
                    <TabsTrigger value="personas" className="gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5" />
                        Personas
                        {personaSets.length > 0 && (
                            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                {personaSets.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value="files" className="h-full m-0 p-4">
                        <FileUploader />
                    </TabsContent>

                    <TabsContent value="links" className="h-full m-0 p-4">
                        <ScrollArea className="h-full">
                            <LinkManager />
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="text" className="h-full m-0">
                        <ExtractedTextViewer />
                    </TabsContent>

                    <TabsContent value="personas" className="h-full m-0">
                        <PersonaViewer />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Notes Section (Always Visible) */}
            <div className="border-t border-border">
                <NoteEditor />
            </div>
        </div>
    );
}
