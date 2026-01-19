# Verification Matrix (Rigor Max)

| ID | Description | Code Component | Test ID | Evidence Path | Chrome Status | Edge Status |
|----|-------------|----------------|---------|---------------|---------------|-------------|
| **ICONS** | | | | | | |
| I-01 | API Key Button (Header) | `header.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-02 | Theme Toggle | `header.tsx` | - | - | VERIFIED (Live) | VERIFIED (Live) |
| I-03 | Mobile Menu | `header.tsx` | - | - | VERIFIED (Live) | VERIFIED (Live) |
| I-04 | Reset All | `header.tsx` | - | - | VERIFIED (Live) | VERIFIED (Live) |
| I-05 | Attach File (Chat) | `chat-composer.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-06 | Generate (Sparkles) | `chat-composer.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-07 | Send Message | `chat-composer.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-08 | Tab: Files | `context-panel.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-09 | Tab: Links | `context-panel.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-10 | Tab: Text | `context-panel.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-11 | Tab: Personas | `context-panel.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| CTA-1 | Upload File | `empty-state.tsx` | `e2e/empty-state-ctas.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| CTA-2 | Paste Text | `empty-state.tsx` | `e2e/empty-state-ctas.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| CTA-3 | Describe Role | `empty-state.tsx` | `e2e/empty-state-ctas.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| F-01 | File Awareness | `chat.ts` | `e2e/file-read-success.spec.ts` | `proof_bundle/reports` | PENDING | PENDING |
| F-02 | Content Quoting | `chat.ts` | `e2e/file-read-success.spec.ts` | `proof_bundle/reports` | PENDING | PENDING |
| I-12 | Toggle Notes | `note-editor.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-13 | Notes Chevron | `note-editor.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-14 | Setup: Eye | `api-key-dialog.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| I-15 | Setup: Close | `dialog.tsx` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| **WORKFLOWS** | | | | | | |
| W-01 | Secure Setup (Auth) | `useVacancyStore` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| W-02 | Ingest Data (Context) | `useVacancyStore` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| W-03 | Generate Personas | `useVacancyStore` | `e2e/rigor-max.spec.ts` | `proof_bundle/reports` | VERIFIED (Live) | VERIFIED (Live) |
| **PERSISTENCE** | | | | | | |
| P-01 | Vacancy Create/Save | `lib/firebase/firestore.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-02 | Vacancy Open/Load | `lib/firebase/firestore.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-03 | Title Rename Persist | `header.tsx` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-04 | Messages Persist | `lib/firebase/firestore.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-05 | Files Persist | `lib/firebase/storage.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-06 | Notes/Links Persist | `lib/firebase/firestore.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-07 | Vacancy Delete | `vacancy-library-modal.tsx` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-08 | Cross-Vacancy Isolation | `lib/firebase/firestore.ts` | `e2e/persistence.spec.ts` | - | PENDING | PENDING |
| P-09 | Security Rules | `firestore.rules` | - | - | PENDING | PENDING |
