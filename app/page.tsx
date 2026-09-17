"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const minLength = 50;
  const maxLength = 5000;
  
  const charCount = text.length;
  const isValid = charCount >= minLength && text.trim().length > 0;
  const isTooShort = charCount > 0 && charCount < minLength;

  const handleSummarize = async () => {
    if (!isValid) return;
    
    setLoading(true);
    setError("");
    setResult("");
    
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize text");
      }
      
      setResult(data.summary);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans transition-colors">
      <main className="w-full max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Summarizer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            Paste your text below to generate a concise and accurate summary.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 md:p-5 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-base leading-relaxed"
              placeholder="Paste your text here (minimum 50 characters)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxLength}
              disabled={loading}
            />
            
            <div className="absolute bottom-4 right-5 text-xs font-medium text-zinc-400 bg-white/80 dark:bg-zinc-900/80 px-2 py-1 rounded-md backdrop-blur-sm">
              {charCount} / {maxLength}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="text-sm h-5">
              {isTooShort && (
                <span className="text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Enter at least {minLength - charCount} more characters
                </span>
              )}
            </div>
            <button
              onClick={handleSummarize}
              disabled={!isValid || loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[160px]"
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Summarizing...
                </span>
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </div>

        {/* Error Section */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-4 flex items-start gap-3 text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Summary
            </div>
            <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
