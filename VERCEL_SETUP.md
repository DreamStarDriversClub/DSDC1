# Vercel Auto-Deploy Setup

> **Goal:** Pushes to `main` on GitHub automatically deploy to dreamstardc.com.

## What This Branch Does

- **`vercel.json`** — Explicitly tells Vercel this is a Next.js project using `bun`. Previously missing, so Vercel relied on auto-detection alone.
- **`next.config.js`** — Now detects Vercel environment (`process.env.VERCEL`) and skips sandbox-specific memory optimizations (CPU limits, webpack cache disable) during Vercel builds.
- **`build-vercel.sh`** — Simplified; the old `next.config.vercel.js` swap is no longer needed.
- **`next.config.vercel.js`** — Removed (dead code).

## What The Owner Must Do (Vercel Dashboard)

### 1. Connect GitHub to the Vercel Project

1. Go to https://vercel.com/dream-star-drivers-club/site
2. Click **Settings** → **Git**
3. Connect to `DreamStarDriversClub/DSDC1` on GitHub
4. Set **Production Branch** to `main`
5. Ensure "Auto Deploy" is enabled for pushes to `main`

### 2. Set Environment Variables

These must be set in the Vercel project dashboard under **Settings → Environment Variables**.
They are NOT committed to git (`.env` is gitignored), so Vercel won't see them otherwise.

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_p6uWkDz5ioEl@ep-ancient-shape-affxoims.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require` | Production DB |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `AV3mfeWS1SEwoAH4eU8qKdMeWXEH_N1uG-BhU77rFwO33526xHUW9K82lZPreu0LB911euk7CCeBEt_t` | Live PayPal Client ID |
| `NEXT_PUBLIC_PRINTFUL_ENABLED` | `true` | Enable Printful integration |
| `PRINTFUL_API_KEY` | `lyHJ8dfFN0RKQW1o46c9x12ruLmm0jf8Mk5wHGOM` | Printful API key (server-side) |
| `NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_APP_ID` | `0f09078c-fb69-441a-8672-9f6cb6f41042` | Elfsight Instagram widget |

**Important:** Set all variables for **Production**, **Preview**, and **Development** environments.

### 3. Verify Domain

1. Settings → Domains
2. Ensure `dreamstardc.com` is assigned as the production domain
3. DNS should already be configured — verify the SSL certificate is active

### 4. Test

After setup, push to `main` (or merge a PR). Go to the Vercel dashboard → Deployments and watch the build. It should:
- Run `bun install`
- Run `next build` 
- Deploy to production at dreamstardc.com

## Troubleshooting

- **Build fails with missing env vars:** Ensure all `NEXT_PUBLIC_*` vars are set in Vercel dashboard (step 2 above).
- **"Framework not detected":** The `vercel.json` in this branch explicitly sets `"framework": "nextjs"`. Make sure this branch is merged to `main`.
- **PayPal doesn't work after deploy:** Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set and is a valid REST API Client ID (not a hosted-button access token starting with "BAA").
