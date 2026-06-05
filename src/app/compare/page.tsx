"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCompare } from "@/context/CompareContext";
import CompareTable from "@/components/CompareTable";
import { GraduationCap, Trash2, Bookmark, Check, Loader2 } from "lucide-react";

export default function ComparePage() {
  const { data: session } = useSession();
  const { compareList, clearCompare } = useCompare();
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveComparison = async () => {
    if (!session) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeIds: compareList.map((c) => c.id),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save comparison.");
      }
    } catch (err) {
      console.error("Failed to save comparison:", err);
      alert("An error occurred while saving the comparison.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Compare Colleges</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Evaluate features, fee structures, ratings and placement packages of up to 3 colleges side-by-side.
            </p>
          </div>
          {compareList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 w-fit">
              {session && (
                <button
                  onClick={handleSaveComparison}
                  disabled={isSaving}
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 border cursor-pointer ${
                    saveSuccess
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save Comparison</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={clearCompare}
                className="flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition duration-200 w-fit cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Compare Content */}
        {compareList.length > 0 ? (
          <div>
            <div className="mb-6 flex justify-end text-xs text-slate-400">
              Comparing {compareList.length} of 3 selected colleges
            </div>
            <CompareTable colleges={compareList} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 p-16 text-center max-w-xl mx-auto">
            <div className="rounded-full bg-slate-900 border border-slate-800 p-5 text-indigo-400 mb-6">
              <GraduationCap className="h-10 w-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Comparison list is empty</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Explore colleges directory and add institutions to start comparing them side-by-side.
            </p>
            <Link
              href="/colleges"
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition duration-200"
            >
              Discover Colleges
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
