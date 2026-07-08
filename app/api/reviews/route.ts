import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { analyzeResume } from '@/lib/openai';
import { checkReviewLimit, getUserPlan } from '@/lib/gating';
// Polyfills for pdf-parse server-side canvas dependencies in Next.js
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class {};
  }
  if (!(global as any).Path2D) {
    (global as any).Path2D = class {};
  }
  if (!(global as any).ImageData) {
    (global as any).ImageData = class {};
  }
}

const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

// GET: List reviews (with tier-based limits)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await getUserPlan(userId);

    let query = supabaseAdmin
      .from('resume_reviews')
      .select('id, job_title, score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Free tier only sees the last 3 reviews
    if (plan === 'free') {
      query = query.limit(3);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Failed to fetch reviews:', error);
      return Response.json({ error: 'Database query failed' }, { status: 500 });
    }

    return Response.json({ reviews });
  } catch (error: any) {
    console.error('GET reviews handler failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new review (includes file upload and parsing)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Check user limits
    const limitStatus = await checkReviewLimit(userId);
    if (!limitStatus.allowed) {
      return Response.json(
        {
          error: 'LIMIT_REACHED',
          message: `Free tier limit reached. You can only review up to ${limitStatus.limit} resumes. Please upgrade to Pro for unlimited access.`,
        },
        { status: 403 }
      );
    }

    // 2. Parse request body (FormData)
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file || !jobTitle || !jobDescription) {
      return Response.json(
        { error: 'Missing required fields: resume (file), jobTitle, jobDescription' },
        { status: 400 }
      );
    }

    // 3. Extract text from resume file
    let resumeText = '';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const parsedPdf = await pdfParse(buffer);
        resumeText = parsedPdf.text || '';
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        return Response.json(
          { error: 'Failed to extract text from PDF. The file may be password protected or corrupted.' },
          { status: 422 }
        );
      }
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      try {
        const parsedDocx = await mammoth.extractRawText({ buffer });
        resumeText = parsedDocx.value || '';
      } catch (err: any) {
        console.error('DOCX parsing error:', err);
        return Response.json(
          { error: 'Failed to extract text from Word Document.' },
          { status: 422 }
        );
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      resumeText = buffer.toString('utf-8');
    } else {
      return Response.json(
        { error: 'Unsupported file type. Please upload a PDF, DOCX or TXT file.' },
        { status: 400 }
      );
    }

    // Basic validation of content
    if (!resumeText.trim()) {
      return Response.json(
        { error: 'Resume file appears to be empty.' },
        { status: 422 }
      );
    }

    // 4. Run AI Analysis
    // Use GPT-4o for Pro plan and GPT-4o-mini for Free plan
    const isPro = limitStatus.plan === 'pro';
    
    let analysisResult;
    try {
      analysisResult = await analyzeResume(resumeText, jobDescription, isPro);
    } catch (openaiErr: any) {
      console.error('OpenAI analysis failed:', openaiErr);
      return Response.json(
        { error: 'The AI model failed to evaluate your resume. Please try again shortly.' },
        { status: 502 }
      );
    }

    // 5. Store Review in Database
    const { data: newReview, error: dbError } = await supabaseAdmin
      .from('resume_reviews')
      .insert({
        user_id: userId,
        job_title: jobTitle,
        job_description: jobDescription,
        resume_text: resumeText,
        score: analysisResult.score,
        feedback: analysisResult.feedback,
      })
      .select('id, job_title, score, created_at')
      .single();

    if (dbError) {
      console.error('Failed to store resume review in DB:', dbError);
      return Response.json(
        { error: 'Analysis succeeded but failed to save to database.' },
        { status: 500 }
      );
    }

    return Response.json({ review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error('POST reviews handler failed:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
