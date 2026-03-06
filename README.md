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
2. Copy environment template:
   - `cp .env.example .env`
3. Add Firebase web app values in `.env`
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

## Admin Access

Primary method (recommended):

- Set Firebase custom claim `admin=true` on admin users.

Fallback method (for local/dev UI gating):

- Add comma-separated emails to `VITE_ADMIN_EMAILS`.

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
  - admin-only reads/updates on submissions
- Base64 size caps are enforced for preview and center image fields to stay within Firestore document limits.
- For stronger anti-bot controls, pair this with Firebase App Check and/or a callable Cloud Function gateway.
