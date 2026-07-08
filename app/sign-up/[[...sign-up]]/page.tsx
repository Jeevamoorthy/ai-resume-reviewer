import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Get Started with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ResumeAI</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create your account to start optimizing your resume
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <SignUp
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
