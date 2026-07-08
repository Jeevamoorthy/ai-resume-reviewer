import React from 'react';
import { Sparkles, Shield } from 'lucide-react';

interface PlanBadgeProps {
  plan: 'free' | 'pro';
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const isPro = plan === 'pro';

  if (isPro) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
        <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
        Pro Member
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
      <Shield className="h-3.5 w-3.5 text-slate-400" />
      Starter Free
    </span>
  );
};
export default PlanBadge;
