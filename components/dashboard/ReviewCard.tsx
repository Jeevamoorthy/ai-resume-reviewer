import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Award } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string;
    job_title: string;
    score: number;
    created_at: string;
  };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate score colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50';
    if (score >= 60) return 'text-amber-400 bg-amber-950/50 border-amber-800/50';
    return 'text-rose-400 bg-rose-950/50 border-rose-800/50';
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Glow highlight */}
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />
      
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors duration-200 line-clamp-1">
            {review.job_title}
          </h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Score Badge */}
          <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium ${getScoreColor(review.score)}`}>
            <Award className="h-4 w-4" />
            <span className="text-lg font-bold">{review.score}</span>
            <span className="text-xs opacity-75">/100</span>
          </div>

          {/* Action button */}
          <Link
            href={`/review/${review.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 transition-all duration-200 group-hover:border-slate-600 group-hover:bg-slate-900 group-hover:text-slate-100"
            id={`view-review-${review.id}`}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ReviewCard;
