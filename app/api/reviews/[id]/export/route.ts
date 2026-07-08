import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUserPlan } from '@/lib/gating';
import { renderToBuffer } from '@react-pdf/renderer';
import { ReviewPDF } from '@/components/review/ReviewPDF';
import React from 'react';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 1. Verify that the user is Pro
    const { plan } = await getUserPlan(userId);
    if (plan !== 'pro') {
      return new Response(
        JSON.stringify({ error: 'Pro feature only', message: 'PDF export is exclusive to the Pro plan.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = await params;

    // 2. Fetch the review detail
    const { data: review, error } = await supabaseAdmin
      .from('resume_reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !review) {
      console.error(`Export failed - review ID ${id} not found:`, error);
      return new Response('Review not found', { status: 404 });
    }

    // 3. Confirm ownership
    if (review.user_id !== userId) {
      return new Response('Forbidden', { status: 403 });
    }

    // 4. Render PDF to Buffer
    // Wrap rendering in a try-catch to log and return errors gracefully
    let pdfBuffer: Buffer;
    try {
      const element = React.createElement(ReviewPDF, { review });
      pdfBuffer = await renderToBuffer(element as any);
    } catch (renderErr) {
      console.error('PDF rendering failed:', renderErr);
      return new Response('Failed to generate PDF document', { status: 500 });
    }

    // 5. Return PDF Response
    const filename = `resume-review-${review.job_title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('GET export handler failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
