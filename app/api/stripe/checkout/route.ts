import { currentUser } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    const userId = user.id;

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      console.error('STRIPE_PRICE_ID_PRO is missing in environment variables');
      return Response.json({ error: 'Stripe is misconfigured. Please check environment variables.' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId: userId,
      },
      success_url: `${appUrl}/dashboard?payment=success`,
      cancel_url: `${appUrl}/billing?payment=cancelled`,
    });

    if (!session.url) {
      throw new Error('Stripe failed to return redirect URL');
    }

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session creation failed:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
