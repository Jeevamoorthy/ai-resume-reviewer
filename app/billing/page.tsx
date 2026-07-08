import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { getUserPlan } from '@/lib/gating';

import { PlanBadge } from '@/components/billing/PlanBadge';
import { CheckoutButton } from '@/components/billing/CheckoutButton';
import { PortalButton } from '@/components/billing/PortalButton';
import { Sparkles, Shield, Check, AlertCircle, LayoutDashboard, CreditCard } from 'lucide-react';
import React from 'react';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string; export?: string; payment?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null; // Middleware handles redirection
  }

  // 1. Await page search params
  const resolvedSearchParams = await searchParams;
  const isLimitRedirect = resolvedSearchParams.limit === 'true';
  const isExportRedirect = resolvedSearchParams.export === 'gate';
  const isPaymentCancelled = resolvedSearchParams.payment === 'cancelled';

  // 2. Fetch current plan details
  const { plan } = await getUserPlan(userId);
  const isPro = plan === 'pro';

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white">
                R
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </Link>
            <span className="h-5 w-px bg-slate-800 hidden sm:inline-block" />
            <nav className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-450 hover:text-slate-200 hover:bg-slate-900/50 transition-all duration-200"
                id="billing-dashboard-nav-link"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/billing"
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-indigo-400"
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-10 lg:px-8">
        
        {/* Warning Banners */}
        {isLimitRedirect && (
          <div className="mb-8 flex gap-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 p-4 text-sm text-indigo-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Review Limit Reached</p>
              <p className="mt-0.5 opacity-90">You have completed your 3 free resume scans. Upgrade to the Pro plan to scan unlimited resumes and unlock GPT-4o details.</p>
            </div>
          </div>
        )}

        {isExportRedirect && (
          <div className="mb-8 flex gap-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 p-4 text-sm text-indigo-300">
            <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Pro Feature Exclusive</p>
              <p className="mt-0.5 opacity-90">PDF report export is only available for Pro members. Upgrade below to download your comprehensive ATS feedback reports.</p>
            </div>
          </div>
        )}

        {isPaymentCancelled && (
          <div className="mb-8 flex gap-3 rounded-lg bg-slate-900 border border-slate-800 p-4 text-sm text-slate-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Checkout Cancelled</p>
              <p className="mt-0.5 opacity-80">The Stripe checkout flow was cancelled. No charges were made. You can attempt to upgrade again whenever you are ready.</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Subscription & Billing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your account plan details, view invoices, and change settings.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Current Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-slate-200">
                {isPro ? "Pro Subscription" : "Starter Free Plan"}
              </span>
              <PlanBadge plan={plan} />
            </div>
          </div>

          <div>
            {isPro ? (
              <PortalButton />
            ) : (
              <span className="text-xs text-slate-500 italic">No recurring billing configured</span>
            )}
          </div>
        </div>

        {/* Plan Cards Side by Side (if Free) or upgrade details */}
        {!isPro ? (
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Free benefits (Read Only) */}
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-200">Starter Free</h3>
              <p className="text-sm text-slate-400">For starting out. Basic details to inspect your match.</p>
              <div className="h-px bg-slate-900" />
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  3 Total Resume Reviews
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  GPT-4o-mini Analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  Detailed ATS score matching
                </li>
              </ul>
            </div>

            {/* Pro Card with Checkout Trigger */}
            <div className="rounded-xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 to-slate-900/10 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
                  Pro Tier Upgrade
                  <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                </h3>
                <p className="text-sm text-indigo-200/70 mt-1">Accelerate your search and scan multiple resumes.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">$19</span>
                  <span className="ml-1 text-sm text-slate-500">/ month</span>
                </div>
              </div>

              <div className="h-px bg-indigo-900/30" />

              <ul className="space-y-3 text-sm text-slate-350">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  <strong>Unlimited</strong> resume reviews
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  Advanced GPT-4o model quality
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  Export PDF Feedback Reports
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  Full matching history saved
                </li>
              </ul>

              <CheckoutButton />
            </div>

          </div>
        ) : (
          <div className="rounded-xl border border-indigo-900/30 bg-indigo-950/5 p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">You are an active Pro Member!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You have unlocked unlimited resume scans, advanced GPT-4o analysis, and PDF report downloads. Keep optimizing your resumes to land your dream role!
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-650 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
