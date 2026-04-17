# NovaLease — Australian Novated Lease Calculator

A 4-way novated lease comparison for Australians: **EV FBT-exempt**, **standard novated (ICE + ECM)**, **buy with cash**, **car loan**. Built with Next.js 16, Tailwind v4, shadcn/ui, and a pure-TypeScript calc library (20 unit tests, zero runtime dependencies on external APIs).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000 (or 3001 if 3000 is busy)
npm test         # run the calc unit tests
npm run build    # production build
```

## What's inside

```
src/
├── app/
│   ├── page.tsx                         # home — hero + calculator + lead form
│   ├── api/lead/route.ts                # POST — appends leads to leads.jsonl (local) or stdout (Vercel)
│   ├── ev-novated-lease-australia/      # pillar SEO page (primary)
│   ├── fbt-exemption-explained/         # pillar SEO page (support)
│   ├── novated-vs-cash-vs-loan/         # pillar SEO page (comparison)
│   ├── privacy/  terms/  disclosure/    # legal
│   ├── robots.ts  sitemap.ts            # SEO metadata
│   └── layout.tsx                       # site chrome + SEO metadata
├── components/
│   ├── Calculator.tsx                   # interactive inputs (client)
│   ├── ResultsPanel.tsx                 # 4-scenario comparison (client)
│   ├── LeadCaptureForm.tsx              # POSTs to /api/lead
│   ├── ContentPage.tsx                  # shared article wrapper
│   └── ui/                              # shadcn primitives
└── lib/
    ├── calc/
    │   ├── constants.ts                 # FY2025-26 tax brackets, FBT, LCT threshold, residuals
    │   ├── tax.ts                       # AU progressive income tax + Medicare
    │   ├── fbt.ts                       # statutory method, ECM, EV exemption eligibility
    │   ├── lease.ts                     # amortised payment with balloon; novated + car loan
    │   ├── runningCosts.ts              # fuel, rego, insurance, servicing, tyres
    │   ├── compare.ts                   # orchestrator — compareScenarios()
    │   └── calc.test.ts                 # 20 unit tests
    └── format.ts                        # AUD formatting
```

## Deploy to Vercel

1. Push the repo to GitHub (or your own host)
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, accept defaults
3. Live at `https://<project-name>.vercel.app` within ~2 minutes
4. Update `metadataBase` in `src/app/layout.tsx` and the base URLs in `src/app/sitemap.ts` + `src/app/robots.ts` once you know the final domain

No env vars are required for v1.

## Leads

- **Local dev**: submissions append to `./leads.jsonl`.
- **On Vercel**: submissions are logged to stdout (captured in Vercel Logs). The filesystem is ephemeral on serverless functions, so file writes won't persist in production. To productionise, swap the handler in `src/app/api/lead/route.ts` for one of:
  - **Resend** — email the lead to yourself (free tier up to 3k/mo)
  - **Neon Postgres** or **Upstash Redis** via Vercel Marketplace — durable storage
  - **Buttondown / ConvertKit** — if you want to nurture via email

Add `leads.jsonl` to `.gitignore` before your first commit.

## After launch

1. **Replace the vercel.app subdomain with a proper .com.au** once the site proves traction (3–6 months of traffic)
2. **Apply for affiliate partnerships**: Fleet Network, Vehicle Solutions, Maxxia, Remserv, Driva — swap placeholders for real tracking URLs once approved
3. **Submit sitemap** to Search Console and Bing Webmaster Tools
4. **Add AdSense** when approved (easy), then migrate to Ezoic/Mediavine at 10k sessions/mo
5. **Review `src/lib/calc/constants.ts`** every July (new FY tax brackets, new LCT threshold)

## What's intentionally NOT here

- **No database** — leads hit a JSONL file locally and stdout on Vercel. Add one only when lead volume requires it.
- **No auth / sign-up** — the whole point is friction-free usage.
- **No analytics** — add Plausible when you're ready.
- **No CMS** — content pages are plain TSX. Rewrite to MDX once you have 10+ pages.
- **No UI tests** — calculator maths is tested; UI is visually verified during build.

## Known caveats in the maths

- Cash scenario **ignores opportunity cost** on the lump sum (simpler to explain to users).
- **Running-cost averages** are national AU figures — state rego/insurance varies materially. Add a state selector for a stronger SEO angle.
- **PHEV new leases** are treated as non-exempt (correct for post-1 Apr 2025). Add a "grandfathered lease" toggle if you want to cover users on pre-2025 PHEV leases.
- **Reportable Fringe Benefits Amount (RFBA)** is mentioned in content but not modelled in the calculator.

## Financial-year update checklist (every July)

In `src/lib/calc/constants.ts`:

- `TAX_BRACKETS` — if further stage-3 tweaks happen
- `LCT_THRESHOLD_FUEL_EFFICIENT` — ATO publishes new figure around June each year
- `DEFAULT_LEASE_INTEREST_RATE` / `DEFAULT_CAR_LOAN_RATE` — if the RBA cash rate has moved materially
- `PETROL_PRICE_PER_LITRE` / `ELECTRICITY_PRICE_PER_KWH` — sanity-check against current averages
