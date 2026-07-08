# ResumeAI — Premium AI-Powered Resume Reviewer SaaS

ResumeAI is a full-stack SaaS product built with Next.js, Clerk, Supabase, OpenAI, and Stripe. It scans resumes (supporting PDF, DOCX, and TXT file uploads), extracts the raw text content, and uses OpenAI's GPT models to grade applicant relevance against target job descriptions. 

## Features
- **Modern Landing Page**: Rich dark-themed SaaS landing page with responsive value propositions and tiered pricing sections.
- **Robust Authentication**: Email/Password and OAuth session-persisted authentication powered by Clerk.
- **File Text Extraction**: Real-time server-side text extraction using `pdf-parse` for PDFs and `mammoth` for DOCX files.
- **AI Matching Assessment**: Grade matches from 0 to 100 with comprehensive categorized bullet points for key strengths, missing gaps, actionable rewrite suggestions, and ATS keywords.
- **Subscription Gates & Limits**:
  - **Free Plan**: Access capped at 3 total resume reviews ever, analyzed with GPT-4o-mini.
  - **Pro Plan ($19/mo)**: Unlimited scans, analyzed with GPT-4o, and option to download high-fidelity PDF reports.
- **Stripe Integration**: Supports subscription payment checkout, automatic customer upgrades, customer portal management, and downgrades on cancel.
- **PDF Report Downloads**: Beautiful printable ATS feedback reports generated via `@react-pdf/renderer`.

---

## Tech Stack
- **Frontend/Backend**: Next.js 14+ (App Router), React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Authentication**: Clerk + Svix (for webhook validation).
- **Database**: Supabase (PostgreSQL) with Row-Level Security.
- **Payments**: Stripe Checkout & Customer Portal.
- **AI Engine**: OpenAI API.

---

## Project Structure
```
ai-resume-reviewer/
├── app/
│   ├── api/
│   │   ├── reviews/                   # List and create reviews (handles file upload & AI analysis)
│   │   │   └── [id]/
│   │   │       ├── export/            # Generates PDF downloads (Pro-only)
│   │   │       └── route.ts           # Fetch individual review details
│   │   ├── stripe/
│   │   │   ├── checkout/              # Triggers Stripe checkout redirect
│   │   │   └── portal/                # Triggers Stripe Customer Portal redirect
│   │   └── webhooks/
│   │       ├── clerk/                 # svix-verified Clerk user synchronization
│   │       └── stripe/                # Upgrades plan on success, downgrades on cancellation
│   ├── billing/                       # View plan status & checkout
│   ├── dashboard/                     # List saved matches & upload trigger
│   ├── review/
│   │   ├── new/                       # Upload resume file details
│   │   └── [id]/                      # Visual feedback gauges & suggestion reports
│   ├── layout.tsx                     # Core layouts + Clerk Provider
│   └── page.tsx                       # Landing marketing page
├── components/                        # Reusable dashboard, billing & review components
├── lib/                               # OpenAI, Stripe, Supabase and billing limits helpers
├── schema.sql                         # PostgreSQL schema for Supabase Setup
├── middleware.ts                      # Clerk path security rules
└── .env.example                       # Reference environment configuration keys
```

---

## Local Setup Instructions

### 1. Clone & Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set Up the Database (Supabase)
1. Go to the [Supabase Dashboard](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in Supabase.
3. Copy the contents of the `schema.sql` file in this repository and execute the query to create tables (`users`, `resume_reviews`) and configure Row Level Security (RLS) policies.
4. Copy your project's **API URL**, **Anon Key**, and **Service Role Key** (secret) to your `.env.local` file.

### 3. Set Up Authentication (Clerk)
1. Go to the [Clerk Dashboard](https://clerk.com) and create an application.
2. In the Clerk dashboard, set the redirects paths:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - After Sign In redirect: `/dashboard`
3. Copy your Clerk API credentials (`Publishable Key` and `Secret Key`) to your `.env.local` file.
4. Go to **Webhooks** in the Clerk dashboard.
5. Create a webhook endpoint targeting: `{YOUR_PUBLIC_APP_URL}/api/webhooks/clerk` and select `user.created`, `user.updated`, and `user.deleted` events.
6. Copy the webhook **Signing Secret** (begins with `whsec_`) and paste it as `CLERK_WEBHOOK_SECRET` in `.env.local`.

### 4. Set Up Payments (Stripe)
1. Go to your [Stripe Dashboard](https://stripe.com) and verify you are in **Test Mode**.
2. Go to **Products** > **Add Product** and create a product named `ResumeAI Pro`.
3. Set the price to `$19.00 USD` recurring monthly. Copy the generated **Price ID** (e.g. `price_...`) to `STRIPE_PRICE_ID_PRO` in `.env.local`.
4. Copy your **Publishable Key** and **Secret Key** to your `.env.local` file.
5. Setup the **Stripe CLI** locally or register a webhook endpoint targeting `{YOUR_PUBLIC_APP_URL}/api/webhooks/stripe`.
6. Listen for these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
7. Copy the webhook signing secret and paste it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 5. Add OpenAI Key
Create an API key in your [OpenAI Dashboard](https://platform.openai.com) and add it as `OPENAI_API_KEY` in `.env.local`.

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the product in action!

---

## Deployment
This application is fully compatible with Vercel:
1. Connect your Github repository to Vercel.
2. Add all keys from your `.env.local` to the Vercel project **Environment Variables** configuration.
3. Set `NEXT_PUBLIC_APP_URL` to your production Vercel URL (e.g. `https://your-app.vercel.app`).
4. Ensure your Clerk and Stripe webhook endpoints point to the same Vercel production URL.
5. Deploy!

