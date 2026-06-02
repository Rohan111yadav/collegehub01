"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import CompareTable from "@/components/CompareTable";
import { GraduationCap, Trash2 } from "lucide-react";

export default function ComparePage() {
  const { compareList, clearCompare } = useCompare();

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
            <button
              onClick={clearCompare}
              className="flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition duration-200 w-fit"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Comparison</span>
            </button>
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
