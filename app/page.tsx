"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleClear = () => {
    setText("");
    setResult("");
    setError("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center pt-12 p-4 md:p-8 font-sans transition-colors">

      <div className="w-full max-w-6xl text-center space-y-3 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Summarizer
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
          Paste your text below to generate a concise and accurate summary.
        </p>
      </div>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Left Column: Input Section */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-4 h-full">
            <div className="relative flex-1 flex flex-col">
              <textarea
                className="w-full flex-1 min-h-[300px] p-4 md:p-5 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-base leading-relaxed"
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

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-2">
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
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleClear}
                  disabled={charCount === 0 || loading}
                  className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center min-w-[100px]"
                >
                  Clear
                </button>
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
          </div>
          
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
        </div>

        {/* Right Column: Summary Section */}
        <div className="flex flex-col gap-4 h-full">
          {result ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4 h-full relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Summary
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-xs text-zinc-400 font-medium">
                    {getWordCount(result)} words
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M15 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm-1 2H6v8h8V6Z" clipRule="evenodd" />
                          <path d="M4 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1v-2H4V4h10v1h2V4a2 2 0 0 0-2-2H4Z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-lg whitespace-pre-wrap flex-1 overflow-y-auto">
                {result}
              </div>
            </div>
          ) : (
            <div className="bg-white/50 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full text-zinc-400 dark:text-zinc-600 min-h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-sm font-medium">Your summary will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
