import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Sparkles, FileText, Target, Zap, Shield, ChevronRight } from 'lucide-react';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-black text-white shadow-md shadow-indigo-600/20">
              R
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-200 via-slate-100 to-purple-200 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 hover:bg-indigo-500 transition-all duration-200"
                id="header-dashboard-btn"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-150"
                  id="header-signin-btn"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 hover:bg-indigo-500 transition-all duration-200"
                  id="header-signup-btn"
                >
                  Start Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/30 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            AI Resume Analyzer & ATS Optimizer
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-none">
            Get more interviews with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI-driven</span> resume feedback
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Upload your resume, paste the target job description, and get instant, detailed feedback. Identify keywords, score match strength, and get concrete tips to optimize your ATS score.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              href={userId ? "/dashboard" : "/sign-up"}
              className="group flex items-center gap-1.5 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 transition-all duration-200"
              id="hero-primary-btn"
            >
              Analyze Your Resume
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#pricing"
              className="text-base font-semibold text-slate-350 hover:text-slate-100 transition-colors duration-150"
            >
              View Pricing &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-900 bg-slate-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-100">
              Optimize your resume for applicant tracking systems
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Everything you need to beat the resume filters and catch the eye of hiring managers.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-8 hover:border-slate-700 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">File Text Extraction</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Simply upload your PDF, DOCX or TXT resume file. We parse the contents securely to analyze the core text structure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-8 hover:border-slate-700 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">ATS Keyword Matching</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Identify key terms, hard skills, and domain knowledge required in the job description that are missing from your resume.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-8 hover:border-slate-700 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Actionable Checklist</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Get specific rewrite suggestions, formatting critiques, and project framing recommendations formatted in a concrete checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t border-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Optimize your resume for free, or unlock premium features to accelerate your job search.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free Tier */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/20 p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Starter Plan</h3>
                <p className="mt-2 text-sm text-slate-450">Perfect to test the waters and optimize your first resume.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="ml-1 text-sm text-slate-500">/ forever</span>
                </div>
                <ul className="mt-8 space-y-4 text-sm text-slate-350">
                  <li className="flex gap-2.5">
                    <Shield className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                    3 total resume reviews
                  </li>
                  <li className="flex gap-2.5">
                    <Shield className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                    GPT-4o-mini analysis
                  </li>
                  <li className="flex gap-2.5">
                    <Shield className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                    Basic ATS score matching
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href={userId ? "/dashboard" : "/sign-up"}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950 py-3 text-center text-sm font-semibold text-slate-200 hover:border-slate-700 hover:text-white transition-all duration-200"
                  id="pricing-free-btn"
                >
                  {userId ? "Go to Dashboard" : "Get Started Free"}
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="relative flex flex-col justify-between rounded-xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 to-slate-900/20 p-8 shadow-md">
              {/* Popular indicator */}
              <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3.5 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20">
                Recommended
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100">Pro Plan</h3>
                <p className="mt-2 text-sm text-indigo-200/80">Everything you need to optimize for multiple roles.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="ml-1 text-sm text-slate-500">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    <strong>Unlimited</strong> resume reviews
                  </li>
                  <li className="flex gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    Advanced GPT-4o analysis
                  </li>
                  <li className="flex gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    Full matching history saved
                  </li>
                  <li className="flex gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    Export PDF Feedback Reports
                  </li>
                  <li className="flex gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    Priority processing speeds
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href={userId ? "/dashboard" : "/sign-up"}
                  className="block w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-600/25 transition-all duration-200"
                  id="pricing-pro-btn"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 bg-slate-950">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 lg:px-8 text-xs text-slate-500 gap-4">
          <p>© 2026 ResumeAI SaaS. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Stripe Test Mode Details</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
