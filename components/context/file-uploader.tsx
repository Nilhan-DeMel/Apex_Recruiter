"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useVacancyStore } from "@/lib/store/vacancy-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    Image,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "text/plain": [".txt"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
};

const maxFileSize = 10 * 1024 * 1024; // 10MB

export function FileUploader() {
    const { files, addFile, removeFile, apiKey } = useVacancyStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const currentApiKey = useVacancyStore.getState().apiKey;
            if (!currentApiKey) return;

            for (const file of acceptedFiles) {
                addFile({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: URL.createObjectURL(file),
                    status: "uploading"
                });

                setIsProcessing(true);

                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const currentFiles = useVacancyStore.getState().files;
                    if (currentFiles[0]?.vectorStoreId) {
                        formData.append("vectorStoreId", currentFiles[0].vectorStoreId);
                    }

                    const response = await fetch("/api/upload", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${currentApiKey}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) throw new Error("Upload failed");

                    const data = await response.json();

                    // Update the file in store
                    useVacancyStore.setState((state) => ({
                        files: state.files.map((f) =>
                            f.name === file.name ? { ...f, ...data, status: "ready" } : f
                        ),
                        extractedText: data.extractedText || state.extractedText
                    }));

                    // Persist to Firebase Storage & Firestore
                    try {
                        const vId = useVacancyStore.getState().vacancyId;
                        if (vId) {
                            const { uploadVacancyFile } = await import("@/lib/firebase/storage");
                            const { addFile: addFileToDb } = await import("@/lib/firebase/firestore");

                            // Use OpenAI file ID as internal key, or fallback
                            const fileId = data.fileId || Math.random().toString(36).substring(2, 15);

                            // Upload the raw file object to Storage
                            const { storagePath } = await uploadVacancyFile(vId, fileId, file);

                            // Metadata to Firestore
                            await addFileToDb(vId, {
                                originalName: file.name,
                                storagePath: storagePath,
                                contentType: file.type,
                                sizeBytes: file.size,
                                extractionStatus: "ready",
                                extractedText: data.extractedText || "",
                                openaiFileId: data.fileId || null,
                                vectorStoreId: data.vectorStoreId || null
                            });
                            console.log("[FileUploader] Persisted file:", fileId);
                        }
                    } catch (persistErr) {
                        console.error("[FileUploader] Persistence failed:", persistErr);
                    }
                } catch (error) {
                    useVacancyStore.setState((state) => ({
                        files: state.files.map((f) =>
                            f.name === file.name ? { ...f, status: "error" } : f
                        )
                    }));
                } finally {
                    setIsProcessing(false);
                }
            }
        },
        [addFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        maxSize: maxFileSize,
        multiple: true,
    });

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
        return <FileText className="h-4 w-4" />;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "uploading":
            case "processing":
                return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
            case "ready":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "error":
                return <AlertCircle className="h-4 w-4 text-destructive" />;
            default:
                return null;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="flex h-full flex-col gap-4">
            <div
                {...getRootProps()}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 text-sm font-medium">
                    {isDragActive ? "Drop files here" : "Drag & drop files"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOCX, TXT, PNG, JPG (max 10MB)
                </p>
            </div>

            {files.length > 0 && (
                <ScrollArea className="flex-1">
                    <div className="space-y-2">
                        {files.map((file) => (
                            <Card key={file.id} className="flex items-center gap-3 p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    {getFileIcon(file.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(file.status)}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => removeFile(file.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {files.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-center">
                    <div className="text-muted-foreground">
                        <FileText className="mx-auto h-8 w-8 opacity-50" />
                        <p className="mt-2 text-sm">No files uploaded yet</p>
                    </div>
                </div>
            )}
        </div>
    );
}
