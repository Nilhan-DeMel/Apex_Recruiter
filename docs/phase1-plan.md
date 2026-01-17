# Phase 1 Implementation Plan

## Overview

**Project**: Apex Recruiter - Vacancy Intelligence Chat
**Goal**: World-class AI-powered vacancy analysis and candidate persona generation
**Stack**: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Firebase

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Firebase Hosting                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (Static Export)                │  │
│  │  ┌──────────────┐  ┌───────────────────────────────┐  │  │
│  │  │  Chat Panel  │  │  Vacancy Context Panel       │  │  │
│  │  │  - Messages  │  │  - Uploads                    │  │  │
│  │  │  - Composer  │  │  - Extracted Text             │  │  │
│  │  │  - Actions   │  │  - Links & Notes              │  │  │
│  │  └──────────────┘  └───────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Cloud Functions (Node 20)                  │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────────┐ │
│  │  /api/chat │  │ /api/parse │  │ /api/generate-personas  │ │
│  │  (OpenAI)  │  │ (PDF/DOCX) │  │ (Structured Output)     │ │
│  └────────────┘  └────────────┘  └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                         Firestore                             │
│  ┌────────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │   /sessions    │  │   /transcripts  │  │   /personas   │  │
│  │   - userId     │  │   - messages[]  │  │   - versions  │  │
│  │   - vacancyId  │  │   - context     │  │   - approvals │  │
│  └────────────────┘  └─────────────────┘  └───────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                       Cloud Storage                           │
│  /uploads/{userId}/{vacancyId}/{filename}                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Feature Breakdown

### 1. Chat UI (Priority: CRITICAL)

| Feature | Implementation |
|---------|----------------|
| Message list | Virtualized scroll, grouped by time |
| Streaming responses | SSE from Cloud Function |
| Markdown rendering | react-markdown + remark-gfm |
| Copy button | Per-message clipboard action |
| Regenerate | Re-run last AI call |
| Quick chips | Predefined prompt modifiers |

### 2. Context Panel (Priority: HIGH)

| Feature | Implementation |
|---------|----------------|
| File upload | Drag & drop + click, Firebase Storage |
| Text extraction | Cloud Function pipeline |
| Link paste | URL input with validation |
| Notes | Freeform textarea |
| Extracted text | Syntax highlighted, copy button |

### 3. Intelligence Loop (Priority: HIGH)

System prompts guide structured conversation:

1. Role summary + assumptions
2. Must-haves / nice-to-haves
3. Scope/level calibration
4. Compensation/notice/location
5. Dealbreakers
6. Sri Lanka constraints

### 4. Persona Generator (Priority: HIGH)

Output schema:

```typescript
interface CandidatePersona {
  id: string;
  type: 'safe_fit' | 'stretch_fit' | 'high_potential' | 'budget_fit' | 'fast_joiner' | 'niche_specialist';
  headline: string;
  summary: string;
  coreSkills: string[];
  domainExperience: string[];
  typicalEmployers: string[];
  salaryBand: { min: number; max: number; currency: string; note: string };
  noticePeriod: string;
  redFlags: string[];
  outreachAngle: string;
  booleanSearchStrings: string[];
}
```

### 5. Export System (Priority: MEDIUM)

| Format | Library | Output |
|--------|---------|--------|
| PDF | pdfkit | Formatted report |
| DOCX | docx.js | Editable document |
| JSON | native | Machine-readable |

---

## Acceptance Criteria

### Security

- [ ] API key never stored in Firestore
- [ ] Key cleared on refresh
- [ ] HTTPS only
- [ ] Input sanitization

### UX Quality

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Responsive on mobile

### Functionality

- [ ] File upload works (PDF, DOCX, TXT, images)
- [ ] Text extraction works
- [ ] Chat streaming works
- [ ] Persona generation works
- [ ] Export works (all 3 formats)

### Deployment

- [ ] Deploys to Firebase Hosting
- [ ] Functions deploy successfully
- [ ] Preview URL accessible

---

## Implementation Order

1. ✅ Create docs structure
2. 🔄 Scaffold Next.js + Tailwind + shadcn
3. 🔜 Initialize Firebase (Hosting, Functions, Firestore, Storage)
4. 🔜 Implement Auth (anonymous)
5. 🔜 Build upload pipeline
6. 🔜 Build chat API with streaming
7. 🔜 Build conversation engine
8. 🔜 Build persona generator
9. 🔜 Build exporters
10. 🔜 QA + accessibility pass
11. 🔜 Deploy + proof pack
