# TaskFlow — redesigned personal workspace

## Open the project

1. Extract the ZIP archive.
2. Open `index.html` in Chrome, Edge, or Firefox. No installation or build is required.
3. Create a demo account, sign in, and continue to `task.html`.
4. Click **New task** to begin, or **Try sample tasks** to explore the design.

`index.html` is now the login page. `register.html` creates a local demo account and `task.html` is the protected workspace.

## What's included

- Responsive dashboard with task statistics and completion progress.
- Board and list layouts; all tasks, due today, upcoming, and completed views.
- Task creation, editing, priority, due date, description, and status.
- Search across titles and descriptions; priority filters and sorting.
- Light/dark appearance, including login/register and mobile controls.
- Login, registration, logout, password hashing, and separate browser-local task storage per demo account.
- Animated cards, floating illustration, modal transitions, statistic transitions, and completion confetti.
- Reduced-motion support, accessible labels, native keyboard-accessible dialogs, and visible focus states.
- Undo for completion, deletion, and clearing tasks (available for 10 seconds).
- JSON task export. The export is a data backup; automatic import is not included.
- Keyboard shortcuts: **N** for a new task and **/** for search, outside text fields.

## Existing task data

The redesign now stores each signed-in demo user under a separate key such as `tf_tasks_v1::user@example.com`. On the first sign-in, existing legacy `tf_tasks_v1` data is copied into that user workspace if no user-specific task data exists. To retain saved tasks, replace the original `task.html`, `app.js`, and `style.css` at the SAME location and use the SAME browser/profile. Keep an original backup first.

Browser storage is tied to the page origin; moving from a local file to a hosted site, changing domains, or opening `index.html` instead of `task.html` may create a separate storage area. Local-file storage behavior varies by browser. A consistent hosted origin is more reliable.

Accounts and tasks stay in this browser only. The login/register feature is an academic frontend demo, not production authentication. Passwords are salted and hashed before being stored, but there is no server-side identity system, shared database, cloud synchronization, or collaboration backend. Clearing browser/site data can erase tasks. Export important tasks periodically. Changes made in another tab prompt a reload; avoid editing the same workspace in multiple tabs simultaneously.

The app works without external JavaScript. Google Fonts is optional; system fonts are used if unavailable.

## Files

- `index.html`: login page.
- `register.html`: registration page.
- `task.html`: protected task workspace and dialogs.
- `auth.js`: local demo authentication and auth-page theme logic.
- `style.css`: responsive design, themes, authentication screens, and animations.
- `app.js`: task logic, per-user storage, profile, logout, and workspace theme logic.
- `vercel.json`: static deployment settings for Vercel.
- `original/`: the original three source files, unchanged.
- Original proposal/report documents are included unchanged. They describe the earlier project and have not been revised to match this interface.

## Editing

Change colors and theme tokens at the top of `style.css`. Modify animation rules near the bottom. Task state and event handlers are in `app.js`.

## Verification

Verified in Chromium at desktop (1440px) and mobile (390px) widths. Checked creation, editing, completion, undo, deletion, search, reload persistence, board/list switching, dark mode, modal Escape behavior, clearing/restoring tasks, and mobile page overflow. No JavaScript errors were observed. Additional DOM checks covered safe rendering of text containing HTML characters. Screenshots with optional sample tasks are in `previews/`.


## Deploy to Vercel

This project is static and requires no build command. Import the project folder into Vercel (or deploy it with the Vercel CLI). Keep the project root at the folder containing `index.html` and `vercel.json`. The login demo will work on Vercel because it uses browser storage; accounts created on one browser/device will not appear on another. For real cross-device authentication, replace the demo auth with a backend service such as Supabase/Firebase or a database-backed API.
