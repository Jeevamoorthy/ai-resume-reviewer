import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's stripe customer id from database
    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (dbError || !user || !user.stripe_customer_id) {
      console.error('Failed to locate Stripe customer ID in database:', dbError);
      return Response.json(
        { error: 'No subscription billing record found. You must be on a active paid subscription to manage billing.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${appUrl}/billing`,
    });

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe billing portal session creation failed:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
