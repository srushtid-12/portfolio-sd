# Srushti Desai · Portfolio

Next.js 16 · React Three Fiber · GSAP · Framer Motion · Tailwind v4 · Resend

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

## Contact form (Resend)

Fill these in `.env.local` (or in your host's environment settings, e.g. Vercel → Settings → Environment Variables):

| Variable | What it is |
| --- | --- |
| `RESEND_API_KEY` | From https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | Your inbox (comma-separate for several) |
| `CONTACT_FROM_EMAIL` | Sender, e.g. `Portfolio <hello@yourdomain.com>`. Must be a domain verified in Resend. For testing use `Portfolio <onboarding@resend.dev>` (delivers only to your Resend account email). |
| `CONTACT_SEND_CONFIRMATION` | `true` to email the visitor a thank-you copy (needs a verified domain) |
| `NEXT_PUBLIC_SITE_URL` | Your live URL, used for metadata |

The API route (`src/app/api/contact/route.ts`) does Zod validation, honeypot and fill-time bot checks, a per-IP rate limit (5 per 10 min), same-origin and body-size checks, HTML escaping, and sets reply-to to the visitor so you can just hit Reply.

## Editing content

- Text: `src/data/cv.ts`
- 3D diagrams (nodes, positions, explanations): `src/data/diagrams.ts`
- Colours / theme tokens: `src/app/globals.css`

## Deploy

Push to GitHub and import into Vercel, add the env variables, deploy.
