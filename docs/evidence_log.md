# Skill Evidence Log

## 1. ms-edge-browser

**Used for**: Verifying the running application on localhost and the deployed URL.

**Attribution (Execution):**
Executed the PowerShell controller script to launch, navigate, and query Edge.

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Nilhan Work\Documents\Nilhan_AI\Browser\Edge-DevTools-Control.ps1" -Command "launch"
powershell -ExecutionPolicy Bypass -File "C:\Users\Nilhan Work\Documents\Nilhan_AI\Browser\Edge-DevTools-Control.ps1" -Command "navigate" -Url "https://apex-recruiter-p1.web.app"
```

**Traceable Marker (Logs):**
From terminal output (Step 588, 634):

```
Starting Edge with DevTools Protocol on port 9222...
Edge connected! Browser: Edg/143.0.3650.139
...
Navigating to: https://apex-recruiter-p1.web.app
Page ID: 7ECD8B61ED531729CA4B75E6CCEB5D2F
Title: Apex Recruiter | Vacancy Intelligence Chat
```

**Marker (Commit):**
Commit includes `[skill:ms-edge-browser]`
`git show e537ac2`

## 2. firebase-deploy

**Used for**: Configuring Firebase Hosting and deploying the application.

**Attribution (Code):**
Created `firebase.json`, `firestore.rules`, `storage.rules`.

**Exact Diff Command:**

```bash
git show e537ac2 -- firebase.json firestore.rules storage.rules
```

**Traceable Marker (Logs):**
From terminal output (Step 630):

```
+  Deploy complete!
Hosting URL: https://apex-recruiter-p1.web.app
```

**Marker (Commit):**
Commit includes `[skill:firebase-deploy]`
`git show e537ac2`

## 3. nextjs-scaffold (Core)

**Used for**: Building the application structure, components, and state management.

**Attribution (Code):**
Created `app/`, `components/`, `lib/`.

**Exact Diff Command:**

```bash
git show e537ac2 -- app/ components/ lib/
```

**Marker (Commit):**
Commit includes `[skill:nextjs-scaffold]`
`git show e537ac2`
