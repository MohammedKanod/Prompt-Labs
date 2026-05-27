---
name: Firebase setup quirks
description: Firestore hangs silently if the database hasn't been created; timeout wrapper prevents infinite skeleton.
---

## Rule
Wrap all Firestore `getDocs`/`getDoc` calls with `withTimeout(promise, 8000)` from `src/lib/firestore.ts`.

**Why:** Firebase SDK does not throw or reject if the Firestore database doesn't exist yet in the Firebase Console — it just hangs. Without a timeout, pages stay in skeleton/loading state forever with no console error.

**How to apply:** Any new Firestore read function must use `withTimeout`. The `seedInitialData()` auto-seed on first load wraps its check in try/catch so it silently no-ops if Firestore is unreachable.

## Firebase project
- Project: prompt-labs-ba475
- Env vars stored as VITE_FIREBASE_* (shared environment)
- Config file: `artifacts/prompt-labs/src/lib/firebase.ts`

## User setup required (one-time)
1. Firebase Console → Firestore Database → Create database → test mode
2. Set Firestore rules (public read, no write)
3. Enable Storage → set Storage rules
4. Admin can seed demo data from /admin → Settings & Data tab
