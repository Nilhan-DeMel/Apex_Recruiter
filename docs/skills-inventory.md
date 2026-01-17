# Phase 1 Skills Inventory

## Applied Skills

| Skill | Purpose | Status |
|-------|---------|--------|
| `premium-dashboard-ui-ux` | Liquid Glass, Bento Grids, modern design | Applied |
| `ui-ux-pro-max` | Typography, color, accessibility | Applied |
| `firebase-deploy` | Firebase deployment patterns | Applied |
| `using-firebase` | Firebase development guidance | Applied |
| `cloud-functions-typescript-starter` | Functions structure | Applied |
| `pdf-official` | PDF generation | Applied |
| `docx-official` | DOCX generation | Applied |
| `react-ui-patterns` | React best practices | Applied |

## Key Design Decisions

### Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Fonts**: Inter (UI) + Outfit (Headings)
- **Icons**: Lucide React
- **Animation**: Framer Motion

### Firebase

- **Hosting**: Firebase Hosting (CDN)
- **Functions**: Node 20, TypeScript
- **Storage**: Firebase Storage (file uploads)
- **Database**: Firestore (transcripts, personas)
- **Auth**: Anonymous (Phase 1)

### OpenAI Integration

- Client stores key in sessionStorage (ephemeral)
- Key sent via HTTPS header to Cloud Function
- Function uses key, never stores it
- Clear key button + auto-clear on refresh

### File Processing

- PDF: pdf-parse + Tesseract (OCR fallback)
- DOCX: mammoth.js
- Images: Tesseract.js for OCR
- TXT: direct read

### Export

- PDF: pdfkit
- DOCX: docx.js
- JSON: native
