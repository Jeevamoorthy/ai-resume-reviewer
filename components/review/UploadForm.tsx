'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, Loader2, AlertCircle, Sparkles, Check } from 'lucide-react';

interface UploadFormProps {
  remainingReviews: number;
  plan: 'free' | 'pro';
}

export const UploadForm: React.FC<UploadFormProps> = ({ remainingReviews, plan }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState('Extracting resume content...');

  const isFree = plan === 'free';
  const isLimitReached = isFree && remainingReviews <= 0;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (validTypes.includes(selectedFile.type) || ['pdf', 'docx', 'txt'].includes(extension || '')) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    } else {
      setError('Please upload a PDF, DOCX, or TXT file.');
      setFile(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      setError('You have reached the limit of free reviews. Please upgrade to Pro.');
      return;
    }

    if (!jobTitle || !jobDescription || !file) {
      setError('Please fill in all fields and upload your resume.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate progression indicators for user wow factor
    setProgressText('Extracting resume content...');
    
    const progressTimer = setTimeout(() => {
      setProgressText('Analyzing structure & job requirements...');
    }, 2500);

    const progressTimer2 = setTimeout(() => {
      setProgressText('Comparing keywords & ATS requirements...');
    }, 5500);

    const progressTimer3 = setTimeout(() => {
      setProgressText('Formulating optimization checklist (almost done)...');
    }, 9000);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.error === 'LIMIT_REACHED') {
          router.push('/billing?limit=true');
          throw new Error('Limit reached');
        }
        throw new Error(data.error || 'Something went wrong during evaluation.');
      }

      router.push(`/review/${data.review.id}`);
    } catch (err: any) {
      if (err.message !== 'Limit reached') {
        setError(err.message || 'An error occurred during evaluation. Please try again.');
      }
      setIsLoading(false);
    } finally {
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex gap-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 p-4 text-sm text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Job Title */}
      <div className="space-y-2">
        <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-200">
          Target Job Title <span className="text-indigo-400">*</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={isLoading || isLimitReached}
          required
          className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label htmlFor="jobDescription" className="block text-sm font-semibold text-slate-200">
          Job Description <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="jobDescription"
          rows={5}
          placeholder="Paste the full job description or requirements here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading || isLimitReached}
          required
          className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      {/* File Upload Drop Zone */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-200">
          Upload Resume (PDF, DOCX or TXT) <span className="text-indigo-400">*</span>
        </label>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={file ? undefined : triggerFileInput}
          className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
            file
              ? 'border-indigo-500/50 bg-indigo-950/5'
              : isDragActive
              ? 'border-indigo-400 bg-indigo-950/10'
              : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
          } ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            disabled={isLoading || isLimitReached}
            className="hidden"
            id="resume-file-input"
          />

          {file ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200 line-clamp-1 max-w-[300px]">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors py-1 px-2.5 rounded hover:bg-rose-950/20"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400 group-hover:text-slate-300">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Drag & drop your resume or <span className="text-indigo-400 hover:underline">browse</span>
              </p>
              <p className="text-xs text-slate-500">
                Supports PDF, DOCX, TXT (Max 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button & Gating Indicator */}
      {isLimitReached ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center">
          <p className="text-sm text-slate-400">
            You have used all {remainingReviews} of your free reviews. 
          </p>
          <a
            href="/billing"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-500"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro to Continue
          </a>
        </div>
      ) : (
        <button
          type="submit"
          disabled={isLoading || !jobTitle || !jobDescription || !file}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-none"
          id="submit-analysis-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
              <span>{progressText}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
              <span>Scan & Analyze Resume</span>
            </>
          )}
        </button>
      )}

      {/* Trust Footnote */}
      <div className="text-center text-xs text-slate-500">
        🔒 Your upload is secure and stored in compliance with privacy regulations.
      </div>
    </form>
  );
};
export default UploadForm;
