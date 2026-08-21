# Firebase security setup

This app uses Firebase for **authentication** and **Cloud Firestore data**. The public NFC profile can be read by visitors; only one configured owner account can edit it.

> **Important:** A private-looking URL is useful to prevent accidental discovery, but it is not security. The owner email check in the UI and Firestore Security Rules must both be configured.

## 1. Create an owner account

In Firebase Console, open **Authentication → Sign-in method** and enable either **Email/Password** or **Google**. Create or select the one owner account that will edit the card.

## 2. Add the hosting environment variables

In your hosting platform’s environment-variable settings, set all six `VITE_FIREBASE_*` values from Firebase Console → Project settings → Your apps → Web app. Then set the two project-specific values below.

| Variable | Purpose |
|---|---|
| `VITE_ADMIN_EMAIL` | The exact Firebase Authentication email allowed to open and edit the panel. |
| `VITE_ADMIN_PATH` | A unique, unlinked one-segment route such as `/studio-8n4k1d`. It must begin with `/` and contain only letters, numbers, and hyphens. |

The values prefixed with `VITE_` are compiled into browser JavaScript. Do not place Firebase service-account keys or other privileged secrets in them.

## 3. Apply Firestore Security Rules

Open **Firestore Database → Rules**, copy `firestore.rules`, replace `OWNER_EMAIL@example.com` with the same email used in `VITE_ADMIN_EMAIL`, then publish the rules.

The rule gives public visitors read access to profile cards while allowing **create, update, and delete** only to the owner. This server-enforced rule is what stops an unauthorised visitor from writing data even if they inspect the client code.

## 4. Create the public document

Create this document in Firestore, or sign in with the owner account and publish the first change through the editor.

```text
profiles / sojib
```

## 5. Access the editor

After hosting variables are set and the site has been rebuilt, open the exact value of `VITE_ADMIN_PATH`. It is deliberately not linked anywhere on the public NFC page. Sign in with the owner Firebase account.

If the address is discovered, an unknown visitor still cannot edit because the route requires the configured owner account and Firestore Rules reject non-owner writes.
