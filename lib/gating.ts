import { supabaseAdmin } from './supabase-admin';

export interface UserPlanStatus {
  plan: 'free' | 'pro';
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

/**
 * Retrieves the user's plan and checkout status from the database.
 * If the user does not exist in the database yet, we look up or initialize
 * their record in the database using details from Clerk (handled separately in webhook, but we handle fallback here).
 */
export async function getUserPlan(userId: string): Promise<UserPlanStatus> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('plan, stripe_customer_id, stripe_subscription_id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user plan:', error);
    return { plan: 'free', stripeCustomerId: null, stripeSubscriptionId: null };
  }

  return {
    plan: (data.plan as 'free' | 'pro') || 'free',
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
  };
}

/**
 * Checks if the user is allowed to create a new resume review.
 * Free tier users are limited to 3 reviews total.
 * Pro users have unlimited reviews.
 */
export async function checkReviewLimit(userId: string): Promise<{
  allowed: boolean;
  count: number;
  limit: number;
  plan: 'free' | 'pro';
}> {
  const { plan } = await getUserPlan(userId);

  if (plan === 'pro') {
    return { allowed: true, count: -1, limit: -1, plan: 'pro' };
  }

  // Count existing reviews for this user
  const { count, error } = await supabaseAdmin
    .from('resume_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error counting resume reviews:', error);
    // Be permissive in case of DB read error, but log it
    return { allowed: true, count: 0, limit: 3, plan: 'free' };
  }

  const reviewCount = count || 0;
  return {
    allowed: reviewCount < 3,
    count: reviewCount,
    limit: 3,
    plan: 'free',
  };
}
