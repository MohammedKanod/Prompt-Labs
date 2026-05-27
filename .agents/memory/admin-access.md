---
name: Admin access mechanism
description: Hidden 20-click Easter egg on About page logo opens password modal; session stored in sessionStorage.
---

## Rule
Admin auth is entirely client-side. No Firebase Auth is used. Password is hardcoded.

**Why:** Client requirement — no user accounts, no email login. Admin is a single person (site owner).

**How to apply:**
- `isAdmin()` / `setAdmin()` in `src/lib/store.ts` use `sessionStorage` key `promptlabs_admin`
- Easter egg: 20 consecutive clicks on the orbital logo on `/about` page within 3 seconds of inactivity reset
- Password: MohammedK@515253
- On correct password → setAdmin(true) → navigate to /admin
- Admin session ends when browser tab closes (sessionStorage)
- Route guard in `/admin` page redirects to `/` if not authenticated
