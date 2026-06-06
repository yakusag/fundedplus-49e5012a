
## FundedPlus — Plan dial Build

### Branding & Design System
- Rename: **FundedPlus** (logo نص بسيط)
- Palette: Ice-blue gradient بدل green:
  - `--primary`: oklch(0.72 0.14 230) — ice blue
  - `--primary-glow`: oklch(0.85 0.11 210) — light cyan
  - `--gradient-primary`: linear-gradient(135deg, #6FD3FF → #2B7FFF)
  - `--gradient-hero`: radial frost glow
  - Background: deep navy `oklch(0.15 0.04 250)` + frosted glass cards
- Typography: Space Grotesk (headings) + Inter (body) عبر @fontsource
- Animations: Framer Motion (hero fade-in, count-up stats, hover lift على cards)

### Site Structure (public routes)
1. `/` — Landing: Hero + Stats + How it works + Challenge tiers preview + Why us + Testimonials + CTA
2. `/challenges` — كاع الـ challenge plans (2-step / 1-step) بـ pricing tiers ($5K → $200K)
3. `/pricing` — Detailed pricing table + payout structure
4. `/faq` — Accordion FAQ
5. `/about` — Mission / team / contact
6. `/auth/sign-in`, `/auth/sign-up` — Clerk components

### Protected User Area (`/_authenticated/`)
- `/dashboard` — Overview: accounts، balance، profit، payouts
- `/dashboard/challenges` — Active challenges + buy new
- `/dashboard/checkout/$planId` — PayTabs payment redirect flow
- `/dashboard/payouts` — Payout requests
- `/dashboard/profile` — Clerk UserProfile

### Admin (منفصل — مش فالـ public site)
- `/admin` route مع role check (Clerk publicMetadata.role === "admin")
- Manage users، approve payouts، view orders — كلشي محمي بـ middleware
- NOT linked في الـ public navigation

### Auth: Clerk
- `@clerk/clerk-react` integration
- `<ClerkProvider>` فالـ `__root.tsx`
- Publishable key محتاجها فالـ code (public) — غادي نطلب منك تعطيها لي فالـ chat
- Server-side: `CLERK_SECRET_KEY` فالـ server functions لـ verify session + role checks

### Payments: PayTabs
- Server function `createPaytabsPayment` يدير POST `/payment/request` لـ PayTabs API بـ `PAYTABS_PROFILE_ID` + `PAYTABS_SERVER_KEY` + region endpoint
- Returns `redirect_url` → client يـ redirect ليه
- Webhook route `/api/public/paytabs-webhook` تـ verify signature + يـ update order status
- Orders جدول في-memory (أو نزيد Lovable Cloud من بعد لـ persistence)

### GitHub Push
- ما نقدرش نستعمل token مباشرة. خاصك:
  1. تكليكي على **Plus (+) → GitHub → Connect project**
  2. تختار account → Create repo بـ اسم **fundedplus**
  3. Lovable غادي يـ sync اوتوماتيكياً (bidirectional)

### Tech notes
- Stack: TanStack Start (المشروع الحالي) + Tailwind v4 + shadcn
- Clerk publishable key: نـ hardcoded فالـ `src/integrations/clerk.ts` (مأمونة، public key)
- Secrets نـ added: `CLERK_SECRET_KEY`, `PAYTABS_PROFILE_ID`, `PAYTABS_SERVER_KEY`, `PAYTABS_REGION`

### Out of scope (v1)
- Database persistence (نقدر نزيد Lovable Cloud من بعد)
- Real trading data integration (mock data فالـ dashboard)
- Email notifications
- KYC verification

### ما محتاج منك دابا:
1. **Clerk Publishable Key** (pk_test_... أو pk_live_...) — paste-ha فـ chat، public key
2. **PAYTABS_REGION value** confirmation (e.g. `ARE`, `SAU`, `EGY`, `GLOBAL`)
3. Confirm: نـ proceed بـ هاد الـ plan؟
