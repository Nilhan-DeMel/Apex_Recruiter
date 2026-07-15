"use client";

import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ContextPanel } from "@/components/context/context-panel";
import { Header } from "@/components/layout/header";
import { ApiKeyDialog } from "@/components/dialogs/api-key-dialog";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { useVacancyStore } from "@/lib/store/vacancy-store";

export default function HomePage() {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const { apiKey, setApiKey } = useVacancyStore();

  useEffect(() => {
    const initializationTimer = window.setTimeout(() => {
      const consentGiven = sessionStorage.getItem("consent_given");
      setShowConsent(!consentGiven);

      const storedKey = sessionStorage.getItem("openai_key");
      setApiKey(storedKey);
      setShowApiKeyDialog(!storedKey);
    }, 0);

    // Clear key on page unload
    const handleUnload = () => {
      sessionStorage.removeItem("openai_key");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.clearTimeout(initializationTimer);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [setApiKey]);

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
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Chat Panel - Left Side */}
        <div className="flex w-full flex-col lg:w-3/5 xl:w-2/3">
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
