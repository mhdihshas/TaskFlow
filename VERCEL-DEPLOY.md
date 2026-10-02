# Deploy TaskFlow to Vercel

## Option 1 — Vercel dashboard

1. Put the contents of this `Task Flow` folder in a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Framework Preset: **Other**.
4. Root Directory: the folder that contains `index.html` and `vercel.json`.
5. Build Command: leave empty.
6. Output Directory: leave empty.
7. Click **Deploy**.

The root URL opens `index.html` (login). After registration/sign-in, users are sent to `task.html`.

## Option 2 — Vercel CLI

From the folder containing `index.html`:

```bash
vercel
```

For production:

```bash
vercel --prod
```

## Important authentication note

This first-year project uses browser-local demo authentication. Accounts, password hashes, sessions, and tasks are saved in that browser's local storage. It is suitable for demonstrating the login/register flow, but it is not a production authentication system and it does not sync across devices. Do not use a real password when testing it.

For production-style authentication later, replace `auth.js` with Supabase Auth, Firebase Authentication, Clerk, Auth0, or a server-side database/API implementation.
