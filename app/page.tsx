"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ContextPanel } from "@/components/context/context-panel";
import { Header } from "@/components/layout/header";
import { ApiKeyDialog } from "@/components/dialogs/api-key-dialog";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { useVacancyStore, Message } from "@/lib/store/vacancy-store";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getVacancy,
  updateVacancy,
  getMessages,
  getFiles,
  getNotes,
  getLinks,
  getPersonas,
} from "@/lib/firebase/firestore";

export default function HomePage() {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [currentVacancyId, setCurrentVacancyId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { uid } = useAuth();
  const {
    apiKey, setApiKey,
    vacancyId, setVacancyId,
    vacancyName, setVacancyName,
    vacancyStatus, setVacancyStatus,
    messages, clearMessages, addMessage,
    files,
    notes,
    links,
    personaSets,
    setExtractedText,
    setThreadId,
    resetAll,
  } = useVacancyStore();

  // Load vacancy from Firestore
  const loadVacancy = useCallback(async (vId: string) => {
    if (!uid) return;

    try {
      const vacancy = await getVacancy(vId);
      if (!vacancy) {
        console.warn("Vacancy not found:", vId);
        return;
      }

      // Reset local state first
      resetAll();
      setVacancyId(vId);
      setCurrentVacancyId(vId);

      // Load vacancy metadata
      setVacancyName(vacancy.title);
      setVacancyStatus(vacancy.status);
      if (vacancy.extractedText) setExtractedText(vacancy.extractedText);
      if (vacancy.threadId) setThreadId(vacancy.threadId);

      // Load subcollections
      const [dbMessages, dbFiles, dbNotes, dbLinks, dbPersonas] = await Promise.all([
        getMessages(vId),
        getFiles(vId),
        getNotes(vId),
        getLinks(vId),
        getPersonas(vId),
      ]);

      // Populate local store with subcollection data
      dbMessages.forEach((msg) => {
        // Use cast to match internal Message type
        addMessage({
          role: msg.role,
          content: msg.content
        });
      });
      // (Simplified: Files/Notes/Links/Personas are currently re-uploaded or added via UI)
      // In a full implementation, we would addFile, addNote, etc. here.

      localStorage.setItem("lastVacancyId", vId);
      setIsDirty(false);
      console.log("[Persistence] Loaded vacancy:", vId);
    } catch (error) {
      console.error("Failed to load vacancy:", error);
    }
  }, [uid, resetAll, setVacancyId, setVacancyName, setVacancyStatus, setExtractedText, setThreadId, addMessage]);

  // Save vacancy to Firestore
  const saveVacancy = useCallback(async () => {
    if (!uid || !vacancyId) return;

    setIsSaving(true);
    try {
      await updateVacancy(vacancyId, {
        title: vacancyName,
        status: vacancyStatus,
        // (Simplified: subcollections are persisted immediately on addition)
      });
      setIsDirty(false);
      console.log("[Persistence] Saved vacancy:", vacancyId);
    } catch (error) {
      console.error("Failed to save vacancy:", error);
    } finally {
      setIsSaving(false);
    }
  }, [uid, vacancyId, vacancyName, vacancyStatus]);

  // Load consent and API key on mount
  useEffect(() => {
    const consentGiven = sessionStorage.getItem("consent_given");
    if (!consentGiven) {
      setShowConsent(true);
    }

    const storedKey = sessionStorage.getItem("openai_key");
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowApiKeyDialog(true);
    }

    // Load last opened vacancy from localStorage
    const lastId = localStorage.getItem("lastVacancyId");
    if (lastId && uid) {
      loadVacancy(lastId);
    }
  }, [setApiKey, uid, loadVacancy]);

  // Mark dirty when store changes (excluding vacancyId change itself)
  useEffect(() => {
    if (vacancyId) {
      setIsDirty(true);
    }
  }, [vacancyName, messages.length, files.length, notes.length, links.length, personaSets.length]);

  // Handle opening a vacancy from the library
  const handleOpenVacancy = useCallback(async (vId: string) => {
    await loadVacancy(vId);
  }, [loadVacancy]);

  const handleConsentAccept = () => {
    sessionStorage.setItem("consent_given", "true");
    setShowConsent(false);
  };

  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem("openai_key", key);
    setApiKey(key);
    setShowApiKeyDialog(false);
  };

  const handleClearKey = () => {
    sessionStorage.removeItem("openai_key");
    setApiKey(null);
    setShowApiKeyDialog(true);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header
        hasApiKey={!!apiKey}
        onClearKey={handleClearKey}
        onSetKey={() => setShowApiKeyDialog(true)}
        onOpenVacancy={handleOpenVacancy}
        onSaveVacancy={saveVacancy}
        currentVacancyId={vacancyId}
        isDirty={isDirty}
        isSaving={isSaving}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Chat Panel - Left Side */}
        <div className="flex w-full flex-col h-full lg:w-3/5 xl:w-2/3">
          <ChatPanel hasApiKey={!!apiKey} />
        </div>

        {/* Context Panel - Right Side */}
        <div className="hidden border-l border-border lg:block lg:w-2/5 xl:w-1/3">
          <ContextPanel />
        </div>
      </main>

      {/* API Key Dialog */}
      <ApiKeyDialog
        open={showApiKeyDialog && !showConsent}
        onOpenChange={setShowApiKeyDialog}
        onSubmit={handleApiKeySubmit}
      />

      {/* Consent Banner */}
      {showConsent && (
        <ConsentBanner onAccept={handleConsentAccept} />
      )}
    </div>
  );
}
