# PERSISTENCE UNBLOCK PLAN

**Generated**: 2026-01-19T18:05:30+05:30  
**Goal**: Complete vacancy persistence E2E verification and deployment

---

## D1: Fastest Unblock Plan (Minimal Change Set)

**Time Estimate**: 30-45 minutes  
**Risk**: LOW (auth already verified, code complete)

### Steps

1. **Deploy Security Rules** (5 min)

   ```powershell
   firebase deploy --only firestore:rules,storage:rules --project apexhren-275cf
   ```

   **Success Criteria**: CLI shows "✔ Deploy complete!"

2. **Create E2E Persistence Test** (15 min)
   - File: `e2e/persistence-smoke.spec.ts`
   - Test: Create vacancy → save → refresh → verify loaded
   **Success Criteria**: Test passes locally

3. **Run E2E Test Suite** (5 min)

   ```powershell
   npx playwright test e2e/ --project="b-chrome-desktop"
   ```

   **Success Criteria**: All tests pass

4. **Commit All Changes** (5 min)

   ```powershell
   git add -A
   git commit -m "feat: Complete Vacancy persistence [skill:firestore-vacancy-crud]"
   git push origin main
   ```

   **Success Criteria**: Git status clean

5. **Manual Smoke Test** (10 min)
   - Create vacancy → rename → save → refresh → verify
   - Upload file → save → refresh → verify
   - Delete vacancy → refresh → verify gone
   **Success Criteria**: All 3 scenarios work

### Total: ~40 minutes  

### Deliverables

- ✅ Rules deployed
- ✅ E2E test passing
- ✅ Code committed
- ✅ Manual verification

---

## D2: Safer Plan (More Robust, Still Minimal)

**Time Estimate**: 90-120 minutes  
**Risk**: VERY LOW (comprehensive verification)

### Steps

1. **Update Config Fallback** (5 min)
   - File: `lib/firebase/config.ts`
   - Change hardcoded fallback to `apexhren-275cf` OR remove entirely
   **Success Criteria**: No stale project IDs in codebase

2. **Deploy Rules to Emulator First** (10 min)

   ```powershell
   firebase emulators:start --only firestore,storage --project apexhren-275cf
   ```

   - Test rules with fake data
   **Success Criteria**: Emulator UI shows rules active

3. **Test Rules in Emulator** (15 min)
   - Create user A, write to `/users/A/vacancies/1` → should succeed
   - Try to read `/users/B/vacancies/2` → should fail
   **Success Criteria**: Access control working

4. **Deploy Rules to Production** (5 min)

   ```powershell
   firebase deploy --only firestore:rules,storage:rules --project apexhren-275cf
   ```

   **Success Criteria**: CLI confirms deployment

5. **Create Comprehensive E2E Tests** (30 min)
   - `e2e/persistence-smoke.spec.ts`: Create/save/load
   - `e2e/persistence-multi-vacancy.spec.ts`: Switch between vacancies
   - `e2e/persistence-delete.spec.ts`: Delete and verify
   **Success Criteria**: All tests pass

6. **Run Full E2E Suite** (10 min)

   ```powershell
   npx playwright test --project="b-chrome-desktop"
   ```

   **Success Criteria**: Green across the board

7. **Wire File Upload Integration** (20 min)
   - Modify `file-uploader.tsx` to call `uploadVacancyFile()` + `addFile()`
   - Test manually: upload PDF → refresh → file persists
   **Success Criteria**: File appears after refresh

8. **Update Documentation** (10 min)
   - `docs/vacancy_persistence_spec.md`: Mark complete
   - `docs/user_manual.md`: Add Vacancy Library usage
   - `docs/skills_evidence_log.md`: Add firestore/storage skills
   **Success Criteria**: Docs reflect reality

9. **Commit & Tag** (5 min)

   ```powershell
   git add -A
   git commit -m "feat: Complete Vacancy persistence with E2E tests [skill:firestore-vacancy-crud] [skill:firebase-auth-rbac] [skill:webapp-e2e-testing-playwright]"
   git tag v1.0.0-persistence
   git push origin main --tags
   ```

   **Success Criteria**: Tagged release

10. **Final Manual Verification** (10 min)
    - Test on localhost
    - Test on Firebase Hosting URL (if deployed)
    **Success Criteria**: PersistenceWorks in both environments

### Total: ~120 minutes  

### Deliverables

- ✅ Rules tested in emulator + deployed
- ✅ 3 E2E tests passing
- ✅ File upload integrated
- ✅ Docs updated
- ✅ Tagged release

---

## D3: 10-Step Execution Checklist

Each step has **Success Criteria** + **Proof Artifact**.

### ☐ STEP 1: Deploy Firestore Rules

**Command**:

```powershell
firebase deploy --only firestore:rules --project apexhren-275cf
```

**Success Criteria**: Output shows "✔ firestore:rules finished running"  
**Proof Artifact**: `docs/proof_bundle/persistence/firebase/firestore_deploy_log.txt`

---

### ☐ STEP 2: Deploy Storage Rules

**Command**:

```powershell
firebase deploy --only storage:rules --project apexhren-275cf
```

**Success Criteria**: Output shows "✔ storage:rules finished running"  
**Proof Artifact**: `docs/proof_bundle/persistence/firebase/storage_deploy_log.txt`

---

### ☐ STEP 3: Create Persistence E2E Test

**File**: `e2e/persistence-smoke.spec.ts`  
**Code**: See template in section D4 below  
**Success Criteria**: File created with 1 test  
**Proof Artifact**: File exists at `e2e/persistence-smoke.spec.ts`

---

### ☐ STEP 4: Run E2E Persistence Test

**Command**:

```powershell
npx playwright test e2e/persistence-smoke.spec.ts --headed --project="b-chrome-desktop"
```

**Success Criteria**: "1 passed" output  
**Proof Artifact**:

- `test-results/persistence-smoke-*/trace.zip`
- Screenshot at docs/proof_bundle/persistence/screenshots/

---

### ☐ STEP 5: Wire File Upload to Storage

**Files**:

- `components/context/file-uploader.tsx`
- Integration code example in D4

**Success Criteria**: Upload file → refresh → file persists  
**Proof Artifact**: Screenshot of Files panel after refresh

---

### ☐ STEP 6: Wire Chat Messages to Firestore

**Files**:

- `components/chat/chat-panel.tsx`
- Call `addMessage(vacancyId, messageData)` on submit

**Success Criteria**: Send message → refresh → message persists  
**Proof Artifact**: Screenshot of chat panel after refresh

---

### ☐ STEP 7: Run Full E2E Suite

**Command**:

```powershell
npx playwright test e2e/ --project="b-chrome-desktop"
```

**Success Criteria**: All tests pass (2+ tests)  
**Proof Artifact**: HTML report at `docs/proof_bundle/persistence/reports/playwright-report/`

---

### ☐ STEP 8: Manual Smoke Test

**Steps**:

1. Create vacancy "Manual Test 1" → Save
2. Refresh page
3. Open Vacancy Library → verify "Manual Test 1" listed
4. Upload test.pdf → Save
5. Refresh page
6. Open Files panel → verify test.pdf listed
7. Delete "Manual Test 1"
8. Refresh page
9. Open Vacancy Library → verify "Manual Test 1" gone

**Success Criteria**: All checkpoints pass  
**Proof Artifact**: Video recording or step-by-step screenshots

---

### ☐ STEP 9: Update Documentation

**Files**:

- `docs/vacancy_persistence_spec.md` → Mark as COMPLETE
- `docs/skills_evidence_log.md` → Add entries for firestore-vacancy-crud, firebase-auth-rbac
- `docs/user_manual.md` → Add Vacancy Library section

**Success Criteria**: Docs match reality  
**Proof Artifact**: Git diff of docs/

---

### ☐ STEP 10: Commit & Push

**Commands**:

```powershell
git add -A
git commit -m "feat: Complete Vacancy persistence with E2E tests [skill:firestore-vacancy-crud] [skill:firebase-auth-rbac] [skill:webapp-e2e-testing-playwright]"
git push origin main
```

**Success Criteria**: `git status` shows "working tree clean"  
**Proof Artifact**: Git log showing commit hash

---

## D4: Code Templates for Integration

### E2E Persistence Test Template

```typescript
// e2e/persistence-smoke.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Vacancy Persistence", () => {
    test("Create, save, refresh, and verify vacancy persists", async ({ page }) => {
        // Go to app
        await page.goto("/");
        
        // Wait for auth
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
        
        // Enter API key (if needed)
        const apiKeyDialog = page.locator('[data-testid="api-key-dialog"]');
        if (await apiKeyDialog.isVisible()) {
            await page.fill('[data-testid="api-key-input"]', 'test-key-for-e2e');
            await page.click('[data-testid="api-key-submit"]');
        }
        
        // Open Vacancy Library
        await page.click('[data-testid="vacancy-library-trigger"]');
        await page.waitForSelector('[data-testid="vacancy-library-modal"]');
        
        // Create new vacancy
        await page.click('[data-testid="new-vacancy-button"]');
        await page.waitForTimeout(1000);
        
        // Rename vacancy
        const vacancyTitle = `E2E Test ${Date.now()}`;
        await page.click('[data-testid="edit-vacancy-title"]');
        await page.fill('[data-testid="vacancy-title-input"]', vacancyTitle);
        await page.click('[data-testid="confirm-rename"]');
        
        // Save
        await page.click('[data-testid="save-vacancy"]');
        await page.waitForTimeout(1000);
        
        // Refresh page
        await page.reload();
        await page.waitForLoadState("networkidle");
        
        // Verify vacancy persists
        await page.click('[data-testid="vacancy-library-trigger"]');
        await expect(page.locator(`text=${vacancyTitle}`)).toBeVisible();
        
        // Clean up: delete vacancy
        await page.click(`[data-vacancy-title="${vacancyTitle}"] [data-testid="delete-vacancy"]`);
        await page.click('[data-testid="confirm-delete"]');
    });
});
```

### File Upload Integration Code

```typescript
// In components/context/file-uploader.tsx
import { uploadVacancyFile } from "@/lib/firebase/storage";
import { addFile } from "@/lib/firebase/firestore";
import { RequireUserId } from "@/lib/firebase/auth";

// After successful OpenAI indexing:
async function handleFileIndexed(file: File, openaiData: { fileId: string; vectorStoreId: string; extractedText: string }) {
    const vacancyId = vacancyStore.getState().vacancyId;
    if (!vacancyId) {
        console.error("No active vacancy ID");
        return;
    }
    
    const uid = requireUserId();
    const fileId = generateId(); // or use openaiData.fileId
    
    // Upload to Storage
    const { storagePath, downloadUrl } = await uploadVacancyFile(uid, vacancyId, fileId, file);
    
    // Write metadata to Firestore
    await addFile(vacancyId, fileId, {
        originalName: file.name,
        storagePath,
        contentType: file.type,
        sizeBytes: file.size,
        uploadedAt: serverTimestamp(),
        extractionStatus: "ready",
        extractedText: openaiData.extractedText,
        openaiFileId: openaiData.fileId,
        vectorStoreId: openaiData.vectorStoreId
    });
    
    console.log("[FileUploader] File persisted to Firestore + Storage");
}
```

---

## D5: Risk List (What Could Still Go Wrong)

### RISK 1: Rules Deny Legitimate Requests 🟡

**Scenario**: User authenticated but rules still block writes  
**Likelihood**: LOW  
**Mitigation**: Test with Firebase emulator first  
**Recovery**: Add debug logging to rules, check `request.auth.uid` vs `userId` match

---

### RISK 2: E2E Test Timeout 🟡

**Scenario**: Async operations (Firestore write) take too long, test times out  
**Likelihood**: MEDIUM  
**Mitigation**: Increase timeouts, add explicit waits  
**Recovery**: Debug with `--headed` mode, check network tab

---

### RISK 3: CORS Issues on Firebase Hosting 🟡

**Scenario**: App deployed to `apexhren-275cf.firebaseapp.com` hits CORS errors  
**Likelihood**: LOW (same origin)  
**Mitigation**: Ensure all Firebase calls use official SDK (handles CORS internally)  
**Recovery**: Check Firebase Console → Hosting settings, verify redirects

---

### RISK 4: Data Migration from Existing Localstorage 🟡

**Scenario**: Users with existing vacancies in localStorage can't migrate to Firestore  
**Likelihood**: MEDIUM (if app already used before persistence)  
**Mitigation**: Implement one-time migration utility  
**Recovery**: Provide manual export/import tool

---

### RISK 5: Git Merge Conflicts 🟡

**Scenario**: Multiple developers working on persistence simultaneously  
**Likelihood**: LOW (solo dev for now)  
**Mitigation**: Commit frequently, pull before push  
**Recovery**: Resolve conflicts manually, prioritize latest work

---

## D6: Success Metrics

### Before Deployment

- [ ] All E2E tests pass (auth + persistence)
- [ ] Rules deployed to production
- [ ] Manual smoke test 100% success rate
- [ ] No console errors in browser
- [ ] Git history clean (all changes committed)

### After Deployment

- [ ] Firebase Console shows data in Firestore
- [ ] Firebase Console shows files in Storage
- [ ] Firebase Hosting serves latest build
- [ ] App works onlocalhostANDproductionURL
- [ ] No regression in existing features (chat, file upload, personas)

---

## D7: Rollback Plan

If deployment causes critical issues:

1. **Revert Rules**:

   ```powershell
   # Edit firestore.rules to allow all temporarily
   match /{document=**} { allow read, write: if true; }
   firebase deploy --only firestore:rules --project apexhren-275cf
   ```

2. **Revert Code**:

   ```powershell
   git revert HEAD
   git push origin main
   ```

3. **Notify Users**: Display maintenance banner if app is live
