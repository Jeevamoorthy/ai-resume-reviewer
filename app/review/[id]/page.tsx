import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

import { getUserPlan } from '@/lib/gating';
import { ScoreRing } from '@/components/review/ScoreRing';
import { FeedbackSection } from '@/components/review/FeedbackSection';
import { ArrowLeft, Download, Sparkles, AlertTriangle, LayoutDashboard, CreditCard } from 'lucide-react';
import React from 'react';

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null; // Handled by middleware
  }

  const { id } = await params;

  // 1. Fetch Review from Supabase
  const { data: review, error } = await supabaseAdmin
    .from('resume_reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !review) {
    console.error(`Review ID ${id} fetch error:`, error);
    notFound();
  }

  // 2. Access control check
  if (review.user_id !== userId) {
    notFound(); // Hide ownership failures as standard 404 for security
  }

  // 3. Check user plan status (for PDF export gate)
  const { plan } = await getUserPlan(userId);
  const isPro = plan === 'pro';

  const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/billing"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-455 hover:text-slate-200 hover:bg-slate-900/50 transition-all duration-200"
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
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-250 transition-colors duration-150 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Top Info Banner Card */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/30 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {review.job_title}
            </h1>
            <p className="text-sm text-slate-400">
              Evaluated on {dateStr}
            </p>
          </div>

          {/* Export Action */}
          <div>
            {isPro ? (
              <a
                href={`/api/reviews/${review.id}/export`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all duration-200"
                id="export-pdf-link"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </a>
            ) : (
              <div className="flex flex-col items-center md:items-end gap-2">
                <Link
                  href="/billing?export=gate"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-indigo-400 hover:border-slate-700 hover:text-indigo-300 transition-all duration-200"
                  id="export-pdf-disabled-btn"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </Link>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Upgrade to Pro to export report
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Summary Row */}
        <div className="grid gap-8 lg:grid-cols-3 mb-10">
          {/* Score Gauge */}
          <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 flex items-center justify-center">
            <ScoreRing score={review.score} />
          </div>

          {/* Core Match Status Text Box */}
          <div className="lg:col-span-2 rounded-xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-center space-y-3">
            <h3 className="text-lg font-bold text-slate-200">ATS Assessment</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {review.score >= 80 ? (
                <span>🎉 Excellent match! Your resume shows strong alignment with the job requirements. It contains key technical keywords and projects that map directly to their requirements. Make the small edits suggested below to finalize.</span>
              ) : review.score >= 60 ? (
                <span>⚠️ Moderate match. You meet several core requirements but lack some essential keywords or explicit skill alignments that applicant tracking systems parse for. Read the Identified Gaps and optimize.</span>
              ) : (
                <span>🛑 Low match. There are substantial gaps between the resume skills and the job requirements. We suggest rewriting major parts of your experience to explicitly highlight the requested technologies and responsibilities.</span>
              )}
            </p>
            <div className="h-px bg-slate-900" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertTriangle className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Matching is calculated using standard semantic match metrics and professional job qualifications.</span>
            </div>
          </div>
        </div>

        {/* Detailed Suggestion Sections */}
        <FeedbackSection feedback={review.feedback} />

      </main>
    </div>
  );
}
