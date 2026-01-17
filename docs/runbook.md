# Runbook

## Prerequisites

- Node.js 20+ (run `node -v` to check)
- npm 9+ (run `npm -v` to check)
- Firebase CLI (`npm install -g firebase-tools`)
- OpenAI API key (starts with `sk-`)

## Local Development

### 1. Install dependencies

```bash
cd Apex_Recruiter
npm install
```

### 2. Run development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for production

```bash
npm run build
```

### 4. Test production build locally

```bash
npm run start
```

## Firebase Deployment

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase (if not already done)

```bash
firebase init
```

Select:

- Hosting
- Functions (for API proxy)
- Firestore
- Storage

### 3. Configure for Next.js static export

Update `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
};
```

### 4. Build and export

```bash
npm run build
```

### 5. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Firebase Emulators (Local Testing)

### 1. Start emulators

```bash
firebase emulators:start
```

### 2. Access emulator UI

Open `http://localhost:4000`

## Troubleshooting

### API key not working

1. Check the key starts with `sk-`
2. Ensure the key has sufficient credits
3. Check browser console for errors

### Build errors

1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npx tsc --noEmit`

### Firebase deployment fails

1. Ensure logged in: `firebase login`
2. Check project: `firebase projects:list`
3. Set project: `firebase use <project-id>`

## Environment Variables

No environment variables are required for Phase 1.

The OpenAI API key is provided by the user at runtime and stored only in browser sessionStorage.
