import React from 'react';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';

interface UsageMeterProps {
  count: number;
  limit: number;
  plan: 'free' | 'pro';
}

export const UsageMeter: React.FC<UsageMeterProps> = ({ count, limit, plan }) => {
  const isPro = plan === 'pro';

  if (isPro) {
    return (
      <div className="rounded-xl border border-indigo-900/40 bg-gradient-to-br from-slate-900 to-indigo-950/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">Pro Subscription Active</h4>
            <p className="text-xs text-indigo-300/80">Unlimited resume optimization unlocked</p>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.min((count / limit) * 100, 100);
  const isLimitReached = count >= limit;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-slate-200">Free Tier Usage</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {count} of {limit} reviews used
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
          Starter
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLimitReached
              ? 'bg-rose-500'
              : percentage >= 66
              ? 'bg-amber-500'
              : 'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Warning / Upgrade CTA */}
      {isLimitReached ? (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2 rounded-lg bg-rose-950/20 border border-rose-900/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>You have used all free reviews. Upgrade to Pro for unlimited reviews and GPT-4o analysis.</p>
          </div>
          <Link
            href="/billing"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-500"
            id="upgrade-usage-cta"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro ($19/mo)
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need more?</span>
          <Link
            href="/billing"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
          >
            Upgrade to Pro &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};
export default UsageMeter;
