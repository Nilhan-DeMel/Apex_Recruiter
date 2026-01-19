# Apex Recruiter: Icon & Workflow Registry

## ICONS (Harvested & Reconciled)

| ID | Icon Name | Location | Trigger Type | Code Component | Status | Verification ID |
|----|-----------|----------|--------------|----------------|--------|-----------------|

## ICONS (Harvested & Reconciled)

| ID | Icon Name | Location | Trigger Type | Code Component | Status | Verification ID |
|----|-----------|----------|--------------|----------------|--------|-----------------|
| I-01 | Key / KeyRound | Header (Desktop) | Button | `header.tsx` | UI-CONFIRMED | UI-ICON-0 |
| I-02 | Sun / Moon | Header (Right) | Button | `header.tsx` | UI-CONFIRMED | UI-ICON-1 |
| I-03 | MoreVertical | Header (Mobile) | Dropdown | `header.tsx` | UI-CONFIRMED | UI-ICON-2 |
| I-04 | Trash2 | Header Menu | Menu Item | `header.tsx` | PENDING | - |
| I-05 | Paperclip | Chat Composer | Button | `chat-composer.tsx` | UI-CONFIRMED | UI-ICON-5 |
| I-06 | Sparkles | Chat Composer | Button | `chat-composer.tsx` | UI-CONFIRMED | UI-ICON-6 |
| I-07 | Send | Chat Composer | Button | `chat-composer.tsx` | UI-CONFIRMED | UI-ICON-7 |
| I-08 | Upload | Context Tabs | Tab Trigger | `context-panel.tsx` | UI-CONFIRMED | UI-ICON-8 |
| I-09 | Link | Context Tabs | Tab Trigger | `context-panel.tsx` | UI-CONFIRMED | UI-ICON-9 |
| I-10 | FileText | Context Tabs | Tab Trigger | `context-panel.tsx` | UI-CONFIRMED | UI-ICON-10 |
| I-11 | Users | Context Tabs | Tab Trigger | `context-panel.tsx` | UI-CONFIRMED | UI-ICON-11 |
| I-12 | StickyNote | Notes Footer | Button | `note-editor.tsx` | UI-CONFIRMED | UI-ICON-14 |
| I-13 | ChevronUp | Notes Footer | Button | `note-editor.tsx` | UI-CONFIRMED | UI-ICON-15 |
| I-14 | Eye | API Key Input | Button | `api-key-dialog.tsx` | UI-CONFIRMED | UI-ICON-18 |
| I-15 | X | Dialog Close | Button | `dialog.tsx` | UI-CONFIRMED | UI-ICON-19 |

## WORKFLOWS (End-to-End)

### W1: Secure Setup

*Goal: Authenticate user to enable AI features.*

1. **Start**: User sees "Welcome / Set Key" overlay or header button.
2. **Action**: Click I-01 (Header) or "Set API Key" (Empty State).
3. **Input**: Type "sk-..." into I-14 (Input). Toggle visibility with I-14 (Eye).
4. **Submit**: Click "Save Key".
5. **System**: Validates -> Stores in `useVacancyStore` -> Updates UI to "Key Set".
6. **Success**: Header shows Green Key. Chat Composer unlocks.

### W2: Ingest Data

*Goal: Provide context for the vacancy.*

1. **Start**: User selects Context Tab (I-08/I-09/I-10).
2. **Files**: Click I-08 -> Drag & Drop -> File parsed -> Badge count +1.
3. **Links**: Click I-09 -> Paste URL -> Add -> Link list updates -> Badge +1.
4. **Text**: Click I-10 -> Paste Job Description -> "Parsed" status.
5. **Success**: `extractedText` is populated in Store.

### W3: Generate Personas

*Goal: Create candidate profiles from context.*

1. **Prerequisite**: W1 (Key) + W2 (Context).
2. **Action**: Type prompt in Chat OR Click I-06 (Sparkles).
3. **Process**: Msg User -> Msg Assistant (Streaming) -> `vacancyStatus`="analyzing".
4. **Output**: System calls tool `generate_personas` -> Store `addPersonaSet`.
5. **UI**: Chat finishes -> `persona-viewer.tsx` appears/focuses -> Status="persona_ready".
6. **Success**: Personas visible in Right Panel (I-11).

## INTERCONNECTION MAP

- [I-01] triggers [W-01]
- [I-08, I-09, I-10] feed into [W-02]
- [I-05, I-06, I-07] trigger [W-03] (dependent on W1+W2)
