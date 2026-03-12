# GENR8-3D Website

Production-style React + Tailwind website for GENR8-3D with a futuristic maker-lab UI.

## Stack

- React 19 + TypeScript
- React Router for multi-page IA
- Tailwind CSS
- Vite
- Firebase Auth + Firestore

## Pages

- `/` Home
- `/services` Services
- `/services/:slug` Service Detail
- `/clocks` Clock Builder + design submission
- `/admin/clocks` Admin review page
- `/portfolio` Portfolio
- `/about` About
- `/contact` Contact + Quote Request

## Local Setup

1. Install dependencies:
   - `npm install`
2. Create a local `.env` file with your Firebase web app values.
4. Start dev server:
   - `npm run dev`
5. Build production output:
   - `npm run build`

## Firebase Setup

1. Enable **Authentication -> Email/Password**.
2. Create **Cloud Firestore**.
3. Deploy Firestore rules and indexes in `firebase/`.

Example with Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Admin Authorization

- Signed-in customers automatically get a `users/{uid}` document with `role: "customer"` the first time the app boots their session.
- Admin access is controlled by the signed-in user's Firestore document at `users/{uid}`.
- A user is treated as admin when that document has either `role: "admin"` or `isAdmin: true`.
- The frontend subscribes to that user record before showing admin UI.
- Firestore rules enforce the same user-document check for admin reads and moderation updates.

## Bootstrap the First Admin

1. Make sure the target user already exists in **Authentication -> Users**.
2. In **Cloud Firestore**, create or update `users/{uid}` for that auth user.
3. Set either `role` to `admin` or `isAdmin` to `true`.
4. Once the document is updated, the admin page will pick up the change from Firestore automatically.

## Clock Design Storage Model

Clock submissions are saved in Firestore `clockSubmissions` with:

- Form/contact data
- Clock configuration (size, wood, number style)
- `centerDesignBase64` (uploaded center image as base64)
- `previewImageBase64` (serialized full SVG preview)
- moderation flags/status

The admin page shows both:

- Saved base64 preview image
- Reconstructed live preview from stored values

## Security Notes

- Firestore rules in `firebase/firestore.rules` enforce:
  - verified email for submission writes
  - user-document-based admin-only reads/updates on submissions
- No frontend email allowlist or custom claim is used for authorization.
- Base64 size caps are enforced for preview and center image fields to stay within Firestore document limits.
- For stronger anti-bot controls, pair this with Firebase App Check and/or a callable Cloud Function gateway.
