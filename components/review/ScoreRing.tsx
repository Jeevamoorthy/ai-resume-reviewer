import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-950/20' }; // emerald
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-950/20' };   // amber
    return { stroke: '#ef4444', text: 'text-rose-400', bg: 'bg-rose-950/20' };     // rose
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle Gauge */}
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Core Value Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
            {score}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            ATS Match
          </span>
        </div>
      </div>
    </div>
  );
};
export default ScoreRing;
