import { create } from "zustand";

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

export interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    extractedText?: string;
    status: "uploading" | "processing" | "ready" | "error";
}

export interface Link {
    id: string;
    url: string;
    title?: string;
    summary?: string;
}

export interface Note {
    id: string;
    content: string;
    timestamp: Date;
}

export interface CandidatePersona {
    id: string;
    type: "safe_fit" | "stretch_fit" | "high_potential" | "budget_fit" | "fast_joiner" | "niche_specialist" | "custom";
    headline: string;
    summary: string;
    coreSkills: string[];
    domainExperience: string[];
    typicalEmployers: string[];
    salaryBand: {
        min: number;
        max: number;
        currency: string;
        note: string;
    };
    noticePeriod: string;
    redFlags: string[];
    outreachAngle: string;
    booleanSearchStrings: string[];
    approved: boolean;
}

export interface PersonaSet {
    id: string;
    version: number;
    createdAt: Date;
    personas: CandidatePersona[];
}

export type VacancyStatus = "draft" | "analyzing" | "persona_ready" | "approved";

interface VacancyState {
    // API Key
    apiKey: string | null;
    setApiKey: (key: string | null) => void;

    // Vacancy metadata
    vacancyName: string;
    setVacancyName: (name: string) => void;
    vacancyStatus: VacancyStatus;
    setVacancyStatus: (status: VacancyStatus) => void;

    // Chat
    messages: Message[];
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    updateMessage: (id: string, content: string) => void;
    setMessageStreaming: (id: string, isStreaming: boolean) => void;
    clearMessages: () => void;

    // Context
    files: UploadedFile[];
    addFile: (file: Omit<UploadedFile, "id">) => void;
    updateFile: (id: string, updates: Partial<UploadedFile>) => void;
    removeFile: (id: string) => void;

    links: Link[];
    addLink: (link: Omit<Link, "id">) => void;
    removeLink: (id: string) => void;

    notes: Note[];
    addNote: (content: string) => void;
    removeNote: (id: string) => void;

    extractedText: string;
    setExtractedText: (text: string) => void;
    appendExtractedText: (text: string) => void;

    // Personas
    personaSets: PersonaSet[];
    addPersonaSet: (personas: CandidatePersona[]) => void;
    updatePersona: (setId: string, personaId: string, updates: Partial<CandidatePersona>) => void;
    togglePersonaApproval: (setId: string, personaId: string) => void;

    // Reset
    resetAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useVacancyStore = create<VacancyState>((set) => ({
    // API Key
    apiKey: null,
    setApiKey: (key) => set({ apiKey: key }),

    // Vacancy metadata
    vacancyName: "New Vacancy",
    setVacancyName: (name) => set({ vacancyName: name }),
    vacancyStatus: "draft",
    setVacancyStatus: (status) => set({ vacancyStatus: status }),

    // Chat
    messages: [],
    addMessage: (message) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: generateId(),
                    timestamp: new Date(),
                },
            ],
        })),
    updateMessage: (id, content) =>
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, content } : m
            ),
        })),
    setMessageStreaming: (id, isStreaming) =>
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, isStreaming } : m
            ),
        })),
    clearMessages: () => set({ messages: [] }),

    // Files
    files: [],
    addFile: (file) =>
        set((state) => ({
            files: [...state.files, { ...file, id: generateId() }],
        })),
    updateFile: (id, updates) =>
        set((state) => ({
            files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
    removeFile: (id) =>
        set((state) => ({
            files: state.files.filter((f) => f.id !== id),
        })),

    // Links
    links: [],
    addLink: (link) =>
        set((state) => ({
            links: [...state.links, { ...link, id: generateId() }],
        })),
    removeLink: (id) =>
        set((state) => ({
            links: state.links.filter((l) => l.id !== id),
        })),

    // Notes
    notes: [],
    addNote: (content) =>
        set((state) => ({
            notes: [
                ...state.notes,
                { id: generateId(), content, timestamp: new Date() },
            ],
        })),
    removeNote: (id) =>
        set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
        })),

    // Extracted text
    extractedText: "",
    setExtractedText: (text) => set({ extractedText: text }),
    appendExtractedText: (text) =>
        set((state) => ({
            extractedText: state.extractedText + (state.extractedText ? "\n\n" : "") + text,
        })),

    // Personas
    personaSets: [],
    addPersonaSet: (personas) =>
        set((state) => ({
            personaSets: [
                ...state.personaSets,
                {
                    id: generateId(),
                    version: state.personaSets.length + 1,
                    createdAt: new Date(),
                    personas: personas.map((p) => ({ ...p, id: generateId() })),
                },
            ],
            vacancyStatus: "persona_ready",
        })),
    updatePersona: (setId, personaId, updates) =>
        set((state) => ({
            personaSets: state.personaSets.map((s) =>
                s.id === setId
                    ? {
                        ...s,
                        personas: s.personas.map((p) =>
                            p.id === personaId ? { ...p, ...updates } : p
                        ),
                    }
                    : s
            ),
        })),
    togglePersonaApproval: (setId, personaId) =>
        set((state) => ({
            personaSets: state.personaSets.map((s) =>
                s.id === setId
                    ? {
                        ...s,
                        personas: s.personas.map((p) =>
                            p.id === personaId ? { ...p, approved: !p.approved } : p
                        ),
                    }
                    : s
            ),
        })),

    // Reset
    resetAll: () =>
        set({
            vacancyName: "New Vacancy",
            vacancyStatus: "draft",
            messages: [],
            files: [],
            links: [],
            notes: [],
            extractedText: "",
            personaSets: [],
        }),
}));
