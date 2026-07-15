# Security boundary

This document describes the code that exists in the repository today. Older architecture plans may discuss a future server-side provider proxy and Firebase persistence; those are not current runtime guarantees.

## OpenAI key handling

The user enters a key at runtime. The application:

- stores it in tab-scoped `sessionStorage`;
- sends it directly to the OpenAI HTTPS endpoint from the browser;
- does not commit it, write it to Firebase, or intentionally log it;
- removes it through the clear-key control and attempts removal on page unload.

This is acceptable for a local prototype, but it is not the preferred production design. Browser code executes in an untrusted environment and any cross-site scripting flaw could access session storage. A production deployment should use a server-side provider proxy, scoped authentication, rate limits, audit logs that exclude content and keys, and a server-held secret.

## Vacancy data

Current chat, link, note, file, extracted-text, and persona state is held in browser memory. TXT files are read locally. Other file types are represented in the UI but are not uploaded to a backend by the current code.

Users should avoid real candidate personal data in this prototype. Formal retention, deletion, consent, and data-subject processes require product and legal review before production use.

## Firebase groundwork

The repository includes owner-scoped Firestore and Storage rules for a planned persistence layer. Because the current UI does not use that layer, the rules are architecture evidence rather than proof of a deployed control. Any deployment must test the rules against emulators and verify the selected Firebase project before use.

## Required production hardening

1. Move model-provider calls behind a server-side route or function.
2. Keep the provider key in the deployment secret store and rotate it on exposure.
3. Add authenticated, tenant-scoped persistence with emulator-tested rules.
4. Parse and sanitize uploaded documents on an isolated backend.
5. Add rate limiting, content-size limits, audit events, and deletion workflows.
6. Complete privacy, accessibility, dependency, and threat-model reviews.
