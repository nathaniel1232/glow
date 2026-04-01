# Glow -- AI Brand Identity Studio

Generate a complete brand identity in 60 seconds. Logo, colors, fonts, voice, and more.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (custom design system)
- **Auth + DB + Storage:** Supabase
- **Payments:** Stripe
- **AI (text):** Google Gemini (2.0 Flash)
- **AI (images):** Replicate (Flux 1.1 Pro)
- **Deployment:** Vercel

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd glow
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

You'll need:
- **Supabase** project URL + anon key + service role key
- **Google Gemini** API key (from Google AI Studio)
- **Replicate** API token
- **Stripe** secret key, webhook secret, and two price IDs

### 3. Set up Supabase

1. Create a new Supabase project
2. Run the SQL schema in your Supabase SQL editor:

```bash
# Copy contents of supabase/schema.sql into the SQL editor
```

3. Enable Email auth in Authentication > Providers
4. Set the site URL to `http://localhost:3000` in Authentication > URL Configuration
5. Add `http://localhost:3000/api/auth/callback` as a redirect URL

### 4. Set up Stripe

1. Create two products in Stripe:
   - **One-time Export** -- $19 one-time payment
   - **Pro Monthly** -- $12/month subscription
2. Copy the price IDs to your `.env.local`
3. Set up a webhook endpoint pointing to `/api/webhooks/stripe` with events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (marketing)/        # Landing page (public)
  (auth)/             # Login, signup
  (app)/              # Dashboard, generate, brand board
    generate/         # Brand creation flow
    brand/[id]/       # Brand board view
    dashboard/        # Saved brands
  api/
    generate/         # Brand generation endpoint
    checkout/         # Stripe checkout session
    webhooks/stripe/  # Stripe webhook handler
    bio/              # Bio link management
    auth/             # Auth callbacks + signout
  bio/[slug]/         # Public link-in-bio pages
components/
  ui/                 # Reusable UI components
  brand/              # Brand-specific components
  marketing/          # Landing page components
lib/
  supabase/           # Supabase client (browser + server)
  ai/                 # Gemini + Replicate integrations
  stripe.ts           # Stripe client + plan config
  db.ts               # Database operations
types/                # TypeScript type definitions
supabase/
  schema.sql          # Database schema
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Update Supabase redirect URLs for production
6. Update Stripe webhook endpoint for production
7. Deploy

## Features

- Real AI brand generation (Gemini + Flux)
- Logo concepts (4 variations: lettermark, wordmark, icon, combination)
- Color palette with hex codes and usage guidelines
- Google Fonts pairing
- Brand voice, tagline, and keywords
- Social media templates (Instagram, Twitter, LinkedIn)
- Link-in-bio page generator
- Stripe payments (one-time + subscription)
- Full auth flow with Supabase
- Dark mode design system
