# Vacancy Case Files Persistence Specification

**Version**: 1.0  
**Date**: 2026-01-19

---

## Overview

Apex Recruiter persists vacancy data to Firebase (Firestore + Cloud Storage) so users don't lose work on refresh.

## Data Model

```
/users/{uid}/vacancies/{vacancyId}
├── title: string
├── status: "draft" | "analyzing" | "persona_ready" | "approved"
├── createdAt, updatedAt, lastOpenedAt: Timestamp
├── extractedText: string
├── threadId: string | null
└── /messages/{id}  → role, content, createdAt
└── /files/{id}     → name, storagePath, status, extractedText
└── /notes/{id}     → content, createdAt
└── /links/{id}     → url, title, createdAt
└── /personas/{id}  → type, headline, approved, ...
```

**Storage**: `/users/{uid}/vacancies/{vacancyId}/files/{fileId}/{filename}`

## Security

- **Firestore**: Only `request.auth.uid == userId` can access `/users/{userId}/**`
- **Storage**: Same user-only access pattern
- **API Key**: Stored in `sessionStorage` only — **never** in Firestore/Storage

## Key Files

| File | Purpose |
|------|---------|
| `lib/firebase/config.ts` | Firebase singleton |
| `lib/firebase/auth.ts` | Anonymous auth |
| `lib/firebase/firestore.ts` | Vacancy CRUD + subcollections |
| `lib/firebase/storage.ts` | File upload/delete |
| `components/auth/auth-provider.tsx` | React context |
| `components/vacancy/vacancy-library-modal.tsx` | List/open/delete vacancies |
| `firestore.rules` | Security rules |
| `storage.rules` | Storage security rules |

## Persistence Flow

1. **On app load**: Anonymous auth → restore last vacancy from `localStorage.lastVacancyId`
2. **On save**: Create/update vacancy doc + subcollections
3. **On message send**: Auto-save message to Firestore
4. **On file upload**: Upload to Storage → save metadata to Firestore
5. **On refresh**: Load vacancy + all subcollections → restore UI state
