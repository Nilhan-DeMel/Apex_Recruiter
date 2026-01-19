# 🚨 BLOCKER: LIVE PROJECT AUTH DISABLED

**Severity**: CRITICAL (Cannot verify persistence on Live site)
**Project**: `apex-recruiter-p1` (LIVE)

## The Problem

You require verification on the **LIVE** project (`apex-recruiter-p1`).
However, **Anonymous Authentication is DISABLED** on this project.
Unlike `apexhren-275cf` (which works), `apex-recruiter-p1` rejects sign-ins with `auth/configuration-not-found`.

## Verification Evidence

1. **Test Failure**: `e2e/live-persistence.spec.ts` FAILED.
2. **Error Log**: `[AuthProvider] Sign in failed: FirebaseError: Firebase: Error (auth/configuration-not-found).`
3. **Implication**: No user = no persistence = no verification.

## The Solution (ONE CLICK REQUIRED)

I cannot click this button for you. You must do it to unblock the RIGOR MAX verification.

1. Go to: **[Firebase Console > Authentication > Sign-in method](https://console.firebase.google.com/project/apex-recruiter-p1/authentication/providers)**
2. Click **"Anonymous"**.
3. Toggle **"Enable"**.
4. Click **"Save"**.

## Current State

- ✅ **Code**: All persistence logic implemented (Store, UI hooks, Services).
- ✅ **Rules**: Deployed to `apex-recruiter-p1`.
- ✅ **Tests**: `e2e/live-persistence.spec.ts` created and ready.
- ❌ **Auth**: BLOCKED.

**ONCE ENABLED:**
Run this command to verify 100% green state:

```powershell
npx playwright test e2e/live-persistence.spec.ts --project="b-chrome-desktop"
```
