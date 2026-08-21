# Personal NFC Profile Link Manager

A mobile-first digital profile card designed for NFC-enabled business cards, badges, and personal identity links. Visitors can open a polished public profile, save contact information, and follow selected social or portfolio routes. Profile content is managed through a private Firebase-protected editor.

**Canonical repository:** [smsojibx/Personal-NFC-Profile-Link-Manager](https://github.com/smsojibx/Personal-NFC-Profile-Link-Manager)

## Highlights

| Capability | Description |
| --- | --- |
| **Public NFC profile** | A fast, responsive profile page served at `/<slug>`. The default profile route is `/sojib`. |
| **Contact actions** | Download a vCard, copy the profile URL, and open curated contact or social links. |
| **Private editor** | The editor is not linked from the public card and requires an authorised Firebase account. |
| **Firebase-backed content** | Firebase Authentication controls editor sign-in, while Cloud Firestore stores profile data. |
| **Netlify deployment** | Includes `netlify.toml` with Vite build settings and single-page application route fallback. |
| **Responsive interface** | Designed and verified for phone, tablet, laptop, and desktop viewports. |

## Technology

The project uses React, TypeScript, Vite, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

## Local development

```bash
git clone https://github.com/smsojibx/Personal-NFC-Profile-Link-Manager.git
cd Personal-NFC-Profile-Link-Manager
pnpm install
pnpm dev
```

Validate the project and create a production build with:

```bash
pnpm check
pnpm build
```

The production site is generated in `dist/public`.

## Deploy to Netlify

1. Create a Netlify project by importing this GitHub repository.

1. Netlify reads the included `netlify.toml` configuration automatically.

1. Confirm the build settings below, then add the required environment variables before deploying.

| Netlify setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Publish directory | `dist/public` |
| Node version | `22` |

The full deployment guide is available in [`README_NETLIFY.md`](./README_NETLIFY.md).

## Configure Firebase

Create a Firebase Web App, then add the following values in **Netlify → Project configuration → Environment variables**. Do not commit real values to the repository.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=owner@example.com
VITE_ADMIN_PATH=/studio-8n4k1d
```

`VITE_ADMIN_EMAIL` identifies the Firebase Authentication account permitted to use the editor. `VITE_ADMIN_PATH` defines an unlinked editor route and must begin with `/`, using letters, numbers, and hyphens only.

> **Security notice:** An unlinked URL is not a security boundary. Enable Firebase Authentication and apply the owner-only Firestore rule in [`firestore.rules`](./firestore.rules). The user-interface owner check and Firestore Security Rules must both be configured.

For the complete Firebase setup process, see [`README_FIREBASE.md`](./README_FIREBASE.md).

## URL structure

| Purpose | Example |
| --- | --- |
| Public NFC card | `https://YOUR-SITE.netlify.app/sojib` |
| Private editor | `https://YOUR-SITE.netlify.app` followed by the `VITE_ADMIN_PATH` value |

The legacy `/admin` route intentionally returns a 404 response. The editor route is never displayed on the public card.

## Security checklist

- [ ] Enable Email/Password or Google in Firebase Authentication.

- [ ] Create the owner account and set its address as `VITE_ADMIN_EMAIL`.

- [ ] Replace `OWNER_EMAIL@example.com` in `firestore.rules` with the same owner email, then publish the rules in Firebase Console.

- [ ] Add all Firebase configuration values only through Netlify environment settings.

- [ ] Use a unique `VITE_ADMIN_PATH` and store it in a password manager.

## Documentation

| File | Purpose |
| --- | --- |
| [`README_NETLIFY.md`](./README_NETLIFY.md) | Netlify deployment and environment-variable instructions. |
| [`README_FIREBASE.md`](./README_FIREBASE.md) | Firebase Authentication, Cloud Firestore, and security-rule setup. |
| [`firestore.rules`](./firestore.rules) | Owner-only Cloud Firestore write policy template. |

## License

See the included [`LICENSE`](./LICENSE) file.

## References

* [Netlify Documentation](https://docs.netlify.com/)
* [Firebase Documentation](https://firebase.google.com/docs)
