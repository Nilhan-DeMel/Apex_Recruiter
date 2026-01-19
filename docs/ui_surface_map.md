# UI Surface Map (Apex Recruiter)

## S1: Welcome Screen

- **State**: Initial Load / No API Key / Consent Accepted
- **Components**:
  - `Header` (Button: "Set API Key")
  - `EmptyState` (Icon: Key, Text: "Welcome to Apex Recruiter")
  - `ConsentBanner` (Hidden if accepted)
- **Proof**: `S1_Welcome.png`

## S2: API Key Dialog

- **State**: Modal Open
- **Components**:
  - `ApiKeyDialog` (Input: Password, Icons: Eye/Key/Alert)
- **Proof**: Code Verified (Screenshot failed due to env)

## S3: Dashboard (Empty)

- **State**: Authenticated, No Vacancy
- **Components**:
  - `ChatPanel` (Input, Chips)
  - `ContextPanel` (Tabs: Files, Text, Links, Personas)
  - `EmptyState` (Cards: Upload, Paste, Describe)
- **Proof**: `S3_Dashboard_Empty.png`

## S4: Context - Files

- **State**: "Files" Tab Active
- **Components**:
  - `FileUploader` (Dropzone, List)
- **Proof**: `S4_Context_Files.png`

## S5: Context - Links

- **State**: "Links" Tab Active
- **Components**:
  - `LinkManager` (Input, Add Button)
- **Proof**: `S5_Context_Links.png`

## S6: Context - Text

- **State**: "Text" Tab Active
- **Components**:
  - `ExtractedTextViewer` (Textarea, Edit/Copy/Save controls)
- **Proof**: `S6_Context_Text.png`

## S7: Context - Personas

- **State**: "Personas" Tab Active
- **Components**:
  - `PersonaViewer` (Cards, Export Buttons)
- **Proof**: `S7_Context_Personas.png`

## S8: Notes Panel

- **State**: Expanded Footer Panel
- **Components**:
  - `NoteEditor` (List, Input)
- **Proof**: `S8_Notes_Panel.png`
