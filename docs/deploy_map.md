# Deploy Map: Apex Recruiter (Live)

- **Expected Public URL**: <https://apex-recruiter-p1.web.app>
- **Confirmed Project ID**: `apex-recruiter-p1`
- **Confirmed Site ID**: `apex-recruiter-p1`
- **Confirmed Deploy Target**: `live`

## Golden Deployment Command

```bash
firebase deploy --only hosting:live --project apex-recruiter-p1 -m "SWIFT LANE: Sync build with git SHA"
```

## Guardrails

- [x] Build stamp visible in UI (SHA + Timestamp)
- [x] Git working tree clean before deploy
- [x] Correct project selected in `.firebaserc`
- [ ] Live verification (Edge/Chrome) confirmed
