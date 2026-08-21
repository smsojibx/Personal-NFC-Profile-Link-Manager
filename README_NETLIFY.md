# Netlify deployment guide

This project is configured for **Netlify static hosting**. The build output is `dist/public`, and `netlify.toml` contains the single-page application fallback required for direct routes such as `/sojib` and the private editor path.

## 1. Upload the source

Create a private GitHub repository, upload this project, then in Netlify choose **Add new project → Import an existing project** and connect that repository.

Netlify detects `netlify.toml`. Confirm these values before deployment:

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Publish directory | `dist/public` |
| Node version | `22` |

## 2. Add build environment variables

In Netlify **Project configuration → Environment variables**, add the Firebase web configuration values from Firebase Console plus the two values below.

| Variable | Example | Why it is needed |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console value | Connects the browser app to your Firebase project. |
| `VITE_FIREBASE_AUTH_DOMAIN` | `project-id.firebaseapp.com` | Firebase Authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | `project-id` | Firestore project identifier. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console value | Firebase Storage configuration. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console value | Firebase web configuration. |
| `VITE_FIREBASE_APP_ID` | Firebase Console value | Firebase web application identifier. |
| `VITE_ADMIN_EMAIL` | `owner@example.com` | The only Firebase account permitted by the editor UI. |
| `VITE_ADMIN_PATH` | `/studio-8n4k1d` | A unique unlinked editor address. Use letters, numbers, and hyphens only. |

After adding or changing any `VITE_` value, trigger a new Netlify deployment. Vite inserts these values during the build process.

## 3. Configure Firebase safely

Follow `README_FIREBASE.md` to enable Firebase Authentication and apply the owner-only Firestore Rules in `firestore.rules`.

> The Netlify URL can remain online as long as the Netlify site and account are retained. For a long-term public address, use a custom domain; hosting-provider policies and free-plan availability can change, so no external free service can guarantee a link forever.

## 4. Use the two URLs

| Purpose | Address |
|---|---|
| NFC card | `https://YOUR-NETLIFY-SITE.netlify.app/sojib` |
| Private editor | `https://YOUR-NETLIFY-SITE.netlify.app` + your `VITE_ADMIN_PATH` value |

The public page contains no link to the editor. Keep the private editor address in a password manager. If another person finds it, they still cannot edit without the owner Firebase account and approved Firestore write permission.

