'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

export const PortalButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePortalRedirect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePortalRedirect}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow hover:bg-slate-850 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        id="manage-billing-btn"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            Opening Portal...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 text-slate-400" />
            Manage Subscription
          </>
        )}
      </button>
      {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
    </div>
  );
};
export default PortalButton;
