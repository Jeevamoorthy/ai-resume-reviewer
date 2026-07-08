import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Tag } from 'lucide-react';

interface FeedbackSectionProps {
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywords: string[];
  };
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback }) => {
  const { strengths = [], weaknesses = [], suggestions = [], keywords = [] } = feedback;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Strengths */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Key Strengths</h3>
        </div>
        
        {strengths.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No significant strengths identified.</p>
        ) : (
          <ul className="space-y-3.5">
            {strengths.map((str, idx) => (
              <li key={`strength-${idx}`} className="flex gap-3 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 mt-2" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weaknesses / Gaps */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Identified Gaps</h3>
        </div>

        {weaknesses.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No critical gaps identified.</p>
        ) : (
          <ul className="space-y-3.5">
            {weaknesses.map((weak, idx) => (
              <li key={`weakness-${idx}`} className="flex gap-3 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 mt-2" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optimization Suggestions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Optimization Checklist</h3>
        </div>

        {suggestions.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No action items suggested.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {suggestions.map((sug, idx) => (
              <li key={`suggestion-${idx}`} className="flex gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 p-4.5 text-sm text-slate-300">
                <span className="text-indigo-400 font-bold leading-none select-none">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Keywords & ATS Terms */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Tag className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Keywords & ATS Terms</h3>
        </div>

        {keywords.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No keywords extracted.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, idx) => (
              <span
                key={`keyword-${idx}`}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors duration-150 hover:border-indigo-500/40 hover:text-slate-100"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FeedbackSection;
