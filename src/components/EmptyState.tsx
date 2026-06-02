"use client";

import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search query or filters to discover other colleges.",
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950/20 p-12 text-center max-w-md mx-auto">
      <div className="rounded-full bg-slate-900 border border-slate-800 p-4 text-indigo-400 mb-5">
        {icon || <Search className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
