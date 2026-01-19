# Apex Recruiter - Full UI/UX User Manual
>
> [!IMPORTANT]
> **VERIFIED BUILD (Rigor Max)**
> This manual reflects the state of the application as of **2026-01-18**, verified across Chrome/Edge (Local & Deployed) with 4/4 passing cycles.
> See `docs/proof_bundle/proof_manifest.json` for validation artifacts.

## SECTION A — SCREEN & STATE INDEX (NUMBERED)

1. **S1: Welcome / No Key State** — Initial load. Centered "Welcome". — 🔐 (Key), ✨ (Sparkles) — Pre: No Key — Out: Prompt — `S1_Welcome.png`
2. **S2: API Key Dialog** — Click "Set API Key". Modal input. — 🔐 (Key), 👁️ (Eye) — Pre: Button Click — Out: Save Key — (Verified by Code)
3. **S3: Empty Vacancy Dashboard** — Key set. Action cards shown. — 📤 (Upload), 📝 (FileText) — Pre: Key Valid — Out: Ready — `S3_Dashboard_Empty.png`
4. **S4: Vacancy Context (Files)** — "Files" tab. Upload list. — 📂 (Upload), ✅ (Check) — Pre: Tab Click — Out: File Mgmt — `S4_Context_Files.png`
5. **S5: Vacancy Context (Links)** — "Links" tab. URL list. — 🔗 (Link), 🌐 (External) — Pre: Tab Click — Out: Link Mgmt — `S5_Context_Links.png`
6. **S6: Vacancy Context (Text)** — "Text" tab. Raw text. — 📄 (FileText), ✏️ (Edit) — Pre: Tab Click — Out: Text Edit — `S6_Context_Text.png`
7. **S7: Vacancy Context (Personas)** — "Personas" tab. Cards. — 👥 (Users), ⬇️ (Download) — Pre: Gen Done — Out: Export — `S7_Context_Personas.png`
8. **S8: Note Editor** — "Notes" footer click. Panel expands. — 📝 (StickyNote), ➕ (Plus) — Pre: Click Footer — Out: User Notes — `S8_Notes_Panel.png`

---

## SECTION B — FEATURE CATALOG (ICON-LED) (NUMBERED)

1. [F1] 🔐 **Set API Key** — Header (Right) — Opens security modal. — Pre: None — Result: Unlock — Proof: S1
2. [F2] 🌙 **Theme Toggle** — Header (Right) — Switches Dark/Light. — Pre: None — Result: Color Change — Proof: S3 (Visible in header)
3. [F3] 📤 **Upload File** — Dashboard/Files Tab — Opens picker. — Pre: Key Set — Result: File Added — Proof: S3, S4
4. [F4] 📝 **Paste Text** — Dashboard/Text Tab — Manual entry. — Pre: Key Set — Result: Text Context — Proof: S3, S6
5. [F5] 🔗 **Add Link** — Links Tab — Adds URL. — Pre: Key Set — Result: Link Context — Proof: S5
6. [F6] 👥 **Personas Tab** — Right Panel — Shows candidates. — Pre: Key Set — Result: View Cards — Proof: S7
7. [F7] ⬇️ **Export** — Personas Tab — Downloads DOCX/PDF. — Pre: Personas Ready — Result: File Download — Proof: S7 (Toolbar)
8. [F8] 📝 **Notes** — Footer — Private scratchpad. — Pre: Key Set — Result: Saved Note — Proof: S8
9. [F9] 💬 **Scrollable Chat** — Left Panel — Auto-scrolls to latest message. Pinned Composer. — Pre: Chat — Result: History View — Proof: Repro_Scroll_Fixed.png

---

## SECTION C — WORKFLOW WALKTHROUGHS

**W1: Secure Setup**
Step 1 (Land on S1) → Step 2 (Click 🔐 Set Key) → Step 3 (Enter sk-...) → Step 4 (Click Save) → Outcome (Land on S3).
*Evidence: S1 -> (Code S2) -> S3.*

**W2: Ingest Data**
Step 1 (On S3) → Step 2 (Click 📤 Upload) → Step 3 (Select PDF) → Step 4 (See 📂 Files Tab updated).
*Evidence: S3 -> S4.*

**W3: Generate Personas**
Step 1 (Data Ready) → Step 2 (Type "Generate 3 personas") → Step 3 (AI Streams) → Step 4 (Auto-switch to S7 👥).
*Evidence: S7.*

---

## SECTION D — INTERCONNECTION MAP

**Icon → Workflows**

* 🔐 (F1) → W1
* 📤 (F3) → W2
* 👥 (F6) → W3, Export

**Workflow → Screens**

* W1 → S1, S2, S3
* W2 → S3, S4
* W3 → S7

---

## SECTION E — USER MANUAL (Task Based)

**How to Start**

1. Click **Set API Key** (top right).
2. Enter your OpenAI key.
3. Click **Save**. You will see the Dashboard (S3).

**How to Add Data**

* **Files**: Click the **Files** tab (right panel) and drop a PDF.
* **Links**: Click **Links** tab and paste a URL.

**How to Export**

1. Generate Personas via chat.
2. Go to **Personas** tab.
3. Click the **Download** (⬇️) icon in the toolbar.

**Chat & Scroll**

* The Left Panel (Chat) scrolls independently.
* The **Composer** (input box) is pinned to the bottom, so you can always type.
* Scroll up to view history; new messages appear at the bottom.

---

## SECTION F — AUDIT QUESTIONS

1. (F1) **Q: Is my key saved?**
    * A: Yes, in browser session memory only. It clears on tab close. (Proof: `page.tsx` code audit).
2. (F3) **Q: What file types?**
    * A: PDF, DOCX, TXT, Images. Max 10MB. (Proof: `file-uploader.tsx` component).
3. (F8) **Q: Are notes shared?**
    * A: No, notes are local key-value state for this session. (Proof: `note-editor.tsx`).
4. (F9) **Q: Can I see old messages?**
    * A: Yes, use the scrollbar in the left pane. The input box will stay visible.

---
**Evidence Screenshots**:
![S1](/docs/proof_bundle/S1_Welcome.png)
![S3](/docs/proof_bundle/S3_Dashboard_Empty.png)
![Fixed Layout](/docs/proof_bundle/Repro_Scroll_Fixed.png)
