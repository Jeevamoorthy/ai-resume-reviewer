'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const CheckoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckoutRedirect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout session');
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handleCheckoutRedirect}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-650 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        id="upgrade-to-pro-btn"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
            Preparing Checkout...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
            Upgrade to Pro — $19/mo
          </>
        )}
      </button>
      {error && <span className="text-xs text-rose-455 text-center mt-1">{error}</span>}
    </div>
  );
};
export default CheckoutButton;
