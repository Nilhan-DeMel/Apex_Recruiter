# Security Documentation

## OpenAI API Key Handling

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Key stored in DB | Key never written to Firestore |
| Key in browser storage | sessionStorage only, cleared on tab close |
| Key in transit | HTTPS only, TLS 1.3 |
| Key in logs | Never logged on server |
| Key exposure via XSS | CSP headers, input sanitization |

### Implementation

```typescript
// Client-side: Store in sessionStorage
const storeApiKey = (key: string) => {
  sessionStorage.setItem('openai_key', key);
};

// Client-side: Get key
const getApiKey = () => sessionStorage.getItem('openai_key');

// Client-side: Clear key
const clearApiKey = () => {
  sessionStorage.removeItem('openai_key');
};

// Auto-clear on page unload (belt + suspenders)
window.addEventListener('beforeunload', clearApiKey);
```

### Server-side (Cloud Function)

```typescript
export const chat = onRequest({ cors: true }, async (req, res) => {
  const apiKey = req.headers['x-openai-key'] as string;
  
  if (!apiKey || !apiKey.startsWith('sk-')) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  
  // Use key, never store it
  const openai = new OpenAI({ apiKey });
  
  // ... process request
  
  // Key goes out of scope and is garbage collected
});
```

### NEVER Do

- ❌ Store key in Firestore
- ❌ Store key in localStorage (persists)
- ❌ Log key on server
- ❌ Send key in URL params
- ❌ Store key in cookies

---

## Firebase Security Rules

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sessions - user can only access own data
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
    
    // Transcripts - user can only access own
    match /transcripts/{transcriptId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
    
    // Personas - user can only access own
    match /personas/{personaId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

---

## PDPA Compliance (Phase 1 Scaffolding)

### Consent Banner

- Displayed on first visit
- Explains data collection
- Links to privacy policy
- User must acknowledge

### Data Retention

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Session data | 30 days | Auto-purge via TTL |
| Uploaded files | 30 days | Auto-purge via lifecycle |
| Transcripts | User-controlled | Delete via UI |
| Personas | User-controlled | Delete via UI |

### User Rights

- View all stored data
- Export data (JSON)
- Delete all data
- Clear session
