# GENR8-3D Website

Production-style React + Tailwind website for GENR8-3D with a futuristic maker-lab UI.

## Stack

- React 19 + TypeScript
- React Router for multi-page IA
- Tailwind CSS (theme tokens for brand colors + typography)
- Vite

## Pages

- `/` Home
- `/services` Services
- `/services/:slug` Service Detail (reusable data-driven layout)
- `/academy` NEXT-GEN Academy
- `/portfolio` Portfolio (filterable + modal)
- `/about` About
- `/contact` Contact + Quote Request

## Local Setup

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Build production output:
   - `npm run build`

## Tailwind Theme

Theme tokens are in `tailwind.config.js`:

- `base`: `#000000`
- `text`: `#ffffff`
- `accent`: `#1428af`
- `accentSoft`: `#608fff`
- `support`: `#2e86ab`
- `fontFamily.poppins`: Poppins

## Notes

Forms currently implement client-side validation and UI success states. Connect them to backend endpoints for live submissions.
