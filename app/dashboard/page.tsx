import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

import { checkReviewLimit, getUserPlan } from '@/lib/gating';
import { ReviewCard } from '@/components/dashboard/ReviewCard';
import { UsageMeter } from '@/components/dashboard/UsageMeter';
import { PaymentSuccessConfetti } from '@/components/dashboard/PaymentSuccessConfetti';
import { Plus, Sparkles, FileText, LayoutDashboard, CreditCard, ChevronRight } from 'lucide-react';
import React, { Suspense } from 'react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null; // Let middleware handle redirection
  }

  // 1. Get plan details & limits
  const { plan } = await getUserPlan(userId);
  const limitStatus = await checkReviewLimit(userId);

  // 2. Fetch user's reviews
  let query = supabaseAdmin
    .from('resume_reviews')
    .select('id, job_title, score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Free tier is capped to visual display of last 3 items
  if (plan === 'free') {
    query = query.limit(3);
  }

  const { data: reviews = [] } = await query;
  const reviewList = reviews || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Confetti Celebration on checkout success */}
      <Suspense fallback={null}>
        <PaymentSuccessConfetti />
      </Suspense>

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
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-indigo-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/billing"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors"
                id="dashboard-billing-nav-link"
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

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main List Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Optimized Resumes
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage and run new optimization evaluations.
                </p>
              </div>

              {/* Create review button */}
              {limitStatus.allowed ? (
                <Link
                  href="/review/new"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 hover:bg-indigo-500 transition-all duration-200"
                  id="dashboard-new-review-btn"
                >
                  <Plus className="h-4 w-4" />
                  New Analysis
                </Link>
              ) : (
                <Link
                  href="/billing"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm font-semibold text-indigo-400 hover:border-slate-700 hover:text-indigo-300 transition-all duration-200"
                  id="dashboard-upgrade-link-btn"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                  Unlock Unlimited
                </Link>
              )}
            </div>

            {/* List */}
            {reviewList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/10 px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-slate-500 mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-md font-semibold text-slate-200">No analyses yet</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
                  Upload your resume and a job description to get your first ATS score and suggestions.
                </p>
                <div className="mt-6">
                  {limitStatus.allowed ? (
                    <Link
                      href="/review/new"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                      id="dashboard-empty-state-new-btn"
                    >
                      <Plus className="h-4 w-4" />
                      Optimize Your First Resume
                    </Link>
                  ) : (
                    <Link
                      href="/billing"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-650 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-650 transition-colors"
                    >
                      Upgrade Plan
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewList.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <UsageMeter
              count={limitStatus.count}
              limit={limitStatus.limit}
              plan={limitStatus.plan}
            />

            {/* Info Box */}
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 space-y-4">
              <h4 className="font-semibold text-slate-350 text-xs uppercase tracking-wider">
                ATS Quick Check
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Applicant Tracking Systems (ATS) scan resumes for matching keywords, professional experiences, and syntax structure. ResumeAI targets these filters using GPT-4o analysis.
              </p>
              <div className="h-px bg-slate-900" />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Free analysis model</span>
                <span className="font-medium text-slate-300">GPT-4o-mini</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pro analysis model</span>
                <span className="font-medium text-indigo-400 flex items-center gap-1">
                  GPT-4o
                  <Sparkles className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
