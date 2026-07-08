import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch review details
    const { data: review, error } = await supabaseAdmin
      .from('resume_reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !review) {
      console.error(`Failed to fetch review ID ${id}:`, error);
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    // Ensure the review belongs to the authenticated user
    if (review.user_id !== userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return Response.json({ review });
  } catch (error: any) {
    console.error('GET single review handler failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
