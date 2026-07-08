-- Enable Row Level Security (RLS) or setup schema for AI Resume Reviewer

-- Create users table (synchronized via Clerk webhook)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,               -- Clerk user ID (e.g. user_...)
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free',          -- 'free' | 'pro'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own record
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id OR (SELECT current_setting('request.jwt.claims', true)::jsonb->>'sub') = id);

-- Create resume_reviews table
CREATE TABLE IF NOT EXISTS public.resume_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  score INTEGER NOT NULL,            -- 0-100 score
  feedback JSONB NOT NULL,           -- Strengths, weaknesses, suggestions, keywords
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on resume_reviews
ALTER TABLE public.resume_reviews ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own reviews
CREATE POLICY "Users can insert their own reviews" 
  ON public.resume_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR (SELECT current_setting('request.jwt.claims', true)::jsonb->>'sub') = user_id);

-- Policy for users to view their own reviews
CREATE POLICY "Users can view their own reviews" 
  ON public.resume_reviews 
  FOR SELECT 
  USING (auth.uid() = user_id OR (SELECT current_setting('request.jwt.claims', true)::jsonb->>'sub') = user_id);
