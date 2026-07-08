import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get('stripe-signature');

  if (!signature) {
    return new Response('Missing Stripe Signature', { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is missing. Cannot verify webhook.');
    return new Response('Server Configuration Error', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const eventType = event.type;
  console.log(`Stripe Webhook Received: event=${eventType}`);

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.error('No userId found in checkout session metadata');
          return new Response('No userId in metadata', { status: 400 });
        }

        // Upgrade user to pro
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: 'pro',
          })
          .eq('id', userId);

        if (error) {
          console.error(`Failed to upgrade user ${userId} to pro:`, error);
          throw error;
        }

        console.log(`Successfully upgraded user ${userId} to Pro plan.`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const status = subscription.status;

        // If the subscription is active, set plan to pro. Otherwise, free.
        const plan = status === 'active' ? 'pro' : 'free';

        // Update plan by stripe subscription ID
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            plan: plan,
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) {
          console.error(`Failed to update subscription ${subscriptionId} status:`, error);
          throw error;
        }

        console.log(`Subscription ${subscriptionId} status updated to ${plan} (${status}).`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        // Reset plan to free and clear subscription ID
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) {
          console.error(`Failed to downgrade cancelled subscription ${subscriptionId}:`, error);
          throw error;
        }

        console.log(`Subscription ${subscriptionId} deleted. Downgraded user to free plan.`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${eventType}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return new Response('Webhook Event Handler Failed', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
