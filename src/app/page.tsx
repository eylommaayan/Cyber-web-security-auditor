"use client";

import { useState } from "react";
import { analyzeSite, AnalysisResponse } from "./actions/analyzeSite";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeSite(urlInput);
      setResult(data);
    } catch {
      // טיפול בשגיאה כללית
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-emerald-400 border-emerald-500 bg-emerald-500/10";
      case "B":
        return "text-blue-400 border-blue-500 bg-blue-500/10";
      case "C":
        return "text-amber-400 border-amber-500 bg-amber-500/10";
      default:
        return "text-rose-400 border-rose-500 bg-rose-500/10";
    }
  };

  return (
    <main
      className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* כותרת ופתיח */}
        <div className="text-center space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> בדיקה פסיבית של כותרות אבטחה
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            סורק חוסן אתרים ומתקפות רשת
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            הזן כתובת URL לניתוח כותרות האבטחה (Security Headers), זיהוי חולשות
            תצורה והבנת סוגי המתקפות שהאתר עלול להיות חשוף אליהן.
          </p>
        </div>

        {/* טופס קלט */}
        <form onSubmit={handleAudit} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="למשל: github.com או example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <Search className="w-5 h-5 absolute left-3 top-4 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
          >
            {loading ? "בודק..." : "סרוק אתר"}
          </button>
        </form>

        {/* תוצאות */}
        {result && (
          <div className="space-y-6">
            {result.error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center">
                {result.error}
              </div>
            ) : (
              <>
                {/* תקציר ציון */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur">
                  <div className="space-y-1 text-center md:text-right">
                    <div className="text-xs text-slate-400">אתר נבדק</div>
                    <div className="text-lg font-bold flex items-center gap-2 text-white">
                      {result.url}
                      <a href={result.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 text-slate-500 hover:text-white" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-slate-400">ציון אבטחה</div>
                      <div className="text-3xl font-black">
                        {result.score}/100
                      </div>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${getGradeColor(result.grade)}`}
                    >
                      {result.grade}
                    </div>
                  </div>
                </div>

                {/* פירוט הבדיקות */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-200">
                    ממצאי כותרות והגנה מפני מתקפות
                  </h3>

                  <div className="grid gap-3">
                    {result.checks.map((c) => (
                      <div
                        key={c.header}
                        className={`p-5 rounded-xl border transition ${
                          c.present
                            ? "bg-slate-900/40 border-slate-800/80"
                            : "bg-rose-950/10 border-rose-900/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold text-base">
                              {c.present ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-400" />
                              )}
                              <span>{c.name}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  c.severity === "high"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : c.severity === "medium"
                                      ? "bg-amber-500/20 text-amber-300"
                                      : "bg-slate-700 text-slate-300"
                                }`}
                              >
                                {c.severity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {c.description}
                            </p>
                          </div>

                          <div className="text-xs font-semibold">
                            {c.present ? (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                מוגן
                              </span>
                            ) : (
                              <span className="text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                                חסר
                              </span>
                            )}
                          </div>
                        </div>

                        {/* הצגת סוגי מתקפות בחוסר */}
                        {!c.present && (
                          <div className="mt-4 pt-3 border-t border-rose-900/20 space-y-2">
                            <div className="flex items-center gap-1 text-rose-300 text-xs font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              מתקפות שהאתר עשוי להיות חשוף אליהן:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {c.vulnerabilities.map((v) => (
                                <span
                                  key={v}
                                  className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-md"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              💡{" "}
                              <span className="font-semibold text-slate-300">
                                המלצה לתיקון:
                              </span>{" "}
                              {c.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
