# Content Needed

Facts the website needs from the business. Everything listed here was **removed,
softened, or left out** because it could not be verified — the site currently makes no
claim about any of it.

Answer an item, and the change is a small edit to the file named beside it.

---

## 1. Claims removed from the site

These were live on the site and stated as fact. If they are true, send the real
figure and the period it covers, and it goes back with confidence.

| Claim that was on the site | Where it was | What we need |
| --- | --- | --- |
| "540+ Projects Delivered" | Home metric strip | Real count, and the date range it covers. |
| "72 hrs Average Prototype Turnaround" | Home metric strip | A turnaround you are willing to stand behind, and for which service. |
| "98% Client Satisfaction" | Home metric strip | How it was measured, sample size, and when. |
| "Short lead times for prototypes" | Home, "Why GENR8-3D" | A concrete lead time, or confirmation this stays qualitative. |
| "documented tolerances" | `src/data/services.ts`, process steps | The tolerances you actually hold, per process. |
| "SLS" / "industrial-grade additive technologies" | `src/data/projects.ts` | **Resolved: FDM only.** Reinstate if SLS is added or outsourced. |

The metric strip now shows facts anyone can check on the site itself (service
count, location, in-house production, named references). Replace them as real
numbers become available: `src/pages/HomePage.tsx`.

---

## 2. Response time

The quote form deliberately promises **no** response time. It says we will reply with
scope and pricing, and nothing about when.

**Needed:** a response time you will consistently meet (e.g. "within 1 business day",
"within 48 hours"). It is one line in `src/components/forms/QuoteForm.tsx` and would
measurably improve conversion — an unanswered "when will I hear back?" is a common
reason people close a quote form.

---

## 3. Photography

### Stock images currently labelled as such

14 images are licensed stock library photos, not GENR8-3D work. Each now carries a
visible "Illustrative stock photograph, not a GENR8-3D project" caption, because
presenting them as client work would be misleading.

- 10 in service galleries — `src/data/services.ts`
- 4 in the portfolio — `src/data/projects.ts`

**Needed:** your own photographs of finished work for each of: CNC routing, 3D
printing, laser engraving, 3D modeling, and a web project. Once supplied, set
`credit: "owned"` on the entry and the caption disappears automatically.

Photo guidance is already written up in `public/products/README.md`.

### Share image

Links shared on WhatsApp, Facebook and LinkedIn currently preview with an existing
product photo (`/products/clocks/one-love-jamaica-clock.webp`, 1000×750).

**Needed:** a purpose-made **1200×630 PNG or JPG** share image with the logo. Drop it at
`public/og-image.png` and update the `og:image` tag in `index.html`.

---

## 4. Quote file uploads

The quote form used to show a file input that recorded the filename and **never sent
the file** — customers believed they had attached a drawing when nothing was
transmitted. That control has been removed and replaced with working email and
WhatsApp routes for sending files.

To accept uploads on the form itself, one of these needs provisioning:

**Option A — Firebase Storage** (project already uses Firebase Auth + Firestore)
1. Enable Cloud Storage in the Firebase console. New projects require the **Blaze**
   plan.
2. Add `storage.rules` restricting writes to a `quote-uploads/` prefix, capping size,
   and allowing only the accepted content types.
3. Enable Anonymous Auth so an unauthenticated visitor can upload under a rule-checked
   identity.
4. Client uses `uploadBytesResumable` for real progress, and the download URL is sent
   with the form.

**Option B — Vercel serverless + Blob**
1. Create a Vercel Blob store; set `BLOB_READ_WRITE_TOKEN` as a server-side env var
   (never `VITE_`-prefixed — that would ship it to the browser).
2. Add an `/api/upload` function that validates type and size server-side and returns
   the stored URL.

Either way: allowlist extensions, cap the size, reject executables, and show upload
progress. Accepted formats are listed in `src/data/contact.ts`.

---

## 5. Business facts the site does not claim

Not currently stated anywhere. Supply any of these and the relevant page can say so:

- **Machines and capacities** — makes/models, maximum sheet size for CNC, build volume
  for the printers, laser bed size and wattage. `src/pages/AboutPage.tsx` currently
  describes the setup only in general terms.
- **Materials** — the lists in `src/data/services.ts` were inherited. Confirm what you
  genuinely stock and cut.
- **Service area** — where you deliver, and whether you ship outside Montego Bay.
- **Certifications or registrations** — none are claimed.
- **Founded date / years operating** — the About page says "started as a local
  fabrication lab" with no dates.
- **Minimum order** — whether one-offs are accepted for every service.

---

## 6. Smaller items

- `index.html` credits `Khamisi Lawrence` as author. Confirm this should stay.
- The favicon is `facivon.ico` (note the spelling) at
  `src/assets/icons/favicon/`. Worth replacing with a proper set
  (`favicon.ico`, `apple-touch-icon.png`) in `public/`.
- Empty gallery categories — `plaques` and `school-furniture` have no photos and show
  a "being finalised" message. See `public/products/README.md`.
- `src/pages/AcademyPage.tsx` and `src/components/forms/AcademyInquiryForm.tsx` are
  **unreachable** — no route points at them, and the header links to
  `academy.genr83d.com` instead. Delete them, or route them, whichever you intend.
  The inquiry form is not wired to any endpoint and would silently discard submissions.
