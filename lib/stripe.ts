import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('Stripe Secret Key is missing. Payments will fail.');
}

export const stripe = new Stripe(stripeSecretKey || 'placeholder_secret_key', {
  apiVersion: '2025-01-27-accursed' as any, // fallback or dynamic if necessary, standard Next version is fine
  appInfo: {
    name: 'AI Resume Reviewer SaaS',
    version: '0.1.0',
  },
});
