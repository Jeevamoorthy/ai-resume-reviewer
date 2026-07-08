import OpenAI from 'openai';

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn('OpenAI API Key is missing. Resume analysis will fail.');
}

const isGeminiKey = openaiApiKey?.startsWith('AIzaSy') || openaiApiKey?.startsWith('AQ.');

export const openai = new OpenAI({
  apiKey: openaiApiKey || 'placeholder_openai_key',
  baseURL: isGeminiKey ? 'https://generativelanguage.googleapis.com/v1beta/openai/' : undefined,
});

export interface ReviewFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
}

export interface ReviewResponse {
  score: number;
  feedback: ReviewFeedback;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  isPro: boolean = false
): Promise<ReviewResponse> {
  const model = isGeminiKey 
    ? (isPro ? 'gemini-2.5-pro' : 'gemini-2.5-flash')
    : (isPro ? 'gpt-4o' : 'gpt-4o-mini');

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
Your task is to analyze the resume text and the job description provided and return a structured JSON evaluation.

The JSON response MUST follow this exact format:
{
  "score": 85, // number from 0 to 100 representing the match strength
  "feedback": {
    "strengths": [
      "Detail of a strong experience, skill, or project mentioned in the resume that aligns well with the job"
    ],
    "weaknesses": [
      "Detail of a skill, tool, or experience missing in the resume that was requested in the job description"
    ],
    "suggestions": [
      "Actionable optimization ideas (e.g. rewrite bullet X to highlight impact, add specific certifications)"
    ],
    "keywords": [
      "Important keywords/skills found or missing (e.g., 'React', 'Project Management')"
    ]
  }
}
Return ONLY valid JSON. Do not include markdown code block formatting like \`\`\`json or any other surrounding text.`,
        },
        {
          role: 'user',
          content: `### Job Description:\n${jobDescription}\n\n### Resume Text:\n${resumeText}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const data: ReviewResponse = JSON.parse(content);
    return data;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    // If it's a JSON parse error or API failure, throw it so the route can handle it
    throw error;
  }
}
