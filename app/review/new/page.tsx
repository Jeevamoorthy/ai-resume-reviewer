import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { checkReviewLimit } from '@/lib/gating';

import { UploadForm } from '@/components/review/UploadForm';
import { ArrowLeft, Sparkles, LayoutDashboard, CreditCard } from 'lucide-react';
import React from 'react';

export default async function NewReviewPage() {
  const { userId } = await auth();

  if (!userId) {
    return null; // Handled by middleware
  }

  // Check limits
  const limitStatus = await checkReviewLimit(userId);

  // If they have exceeded the free limit, redirect to billing immediately
  if (!limitStatus.allowed) {
    redirect('/billing?limit=true');
  }

  const remainingReviews = limitStatus.limit - limitStatus.count;

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
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-455 hover:text-slate-200 hover:bg-slate-900/50 transition-all duration-200"
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
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-10">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-450 hover:text-slate-200 transition-colors duration-150 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Optimize Resume Match
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Specify the target job title, job requirements, and upload your resume.
          </p>
        </div>

        {/* Form Wrap Card */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 md:p-8">
          <UploadForm
            remainingReviews={remainingReviews}
            plan={limitStatus.plan}
          />
        </div>
      </main>
    </div>
  );
}
