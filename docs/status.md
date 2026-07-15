# Implementation status

Last verified: 2026-07-15

## Implemented

- Responsive Next.js chat/context workspace
- User-supplied OpenAI key held in tab-scoped `sessionStorage`
- Direct streaming chat-completions client with incremental UI updates
- Recruitment-specific conversation prompt and quick actions
- Client-side TXT extraction, file inventory, links, notes, and combined context
- Typed vacancy, message, persona, version, and approval state
- Persona review and browser-side PDF/JSON/document export surfaces
- Consent and key-management UI
- Firebase Hosting, Firestore rules, Storage rules, and indexes as deployment groundwork

## Partial or scaffolded

- Non-TXT files reach the upload/review state, but server-side PDF, DOCX, and image extraction is not connected.
- The AI can return persona descriptions in chat, while conversion into the typed persona viewer is not yet wired.
- The export UI exists; the document export is a compatibility prototype rather than native DOCX generation.
- Firebase persistence rules are present, but the current application state remains browser-local.

## Not claimed

- No deployed Cloud Function or App Router API route exists in the current tree.
- No applicant-tracking database, candidate records, or automated outreach is implemented.
- No formal PDPA certification or production security review has been completed.

## Verification

```bash
npm run lint
npm run build
```

The 2026-07-15 employer-release baseline completed ESLint without blocking errors and built all current routes successfully with Next.js 16.1.6 and React 19.2.4.
