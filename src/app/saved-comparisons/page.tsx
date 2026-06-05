"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCompare } from "@/context/CompareContext";
import { College } from "@/types";
import { GitCompare, Lock, Trash2, ArrowRight, Loader2, Calendar, Award } from "lucide-react";

interface SavedComparison {
  id: string;
  collegeIds: string[];
  createdAt: string;
  colleges: College[];
}

export default function SavedComparisonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCompare, clearCompare } = useCompare();
  
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchComparisons = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/comparisons");
      if (res.ok) {
        const data = await res.json();
        setComparisons(data.comparisons);
      }
    } catch (err) {
      console.error("Failed to fetch saved comparisons:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchComparisons();
    } else {
      setIsLoading(false);
    }
  }, [session, fetchComparisons]);

  const handleOpenComparison = (savedComp: SavedComparison) => {
    // Clear existing compare list and load the saved ones
    clearCompare();
    savedComp.colleges.forEach((college) => {
      addToCompare(college);
    });
    router.push("/compare");
  };

  const handleDeleteComparison = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this saved comparison?")) {
      return;
    }

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/comparisons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComparisons((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete comparison.");
      }
    } catch (err) {
      console.error("Failed to delete comparison:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (status === "loading" || (session && isLoading)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-20 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm">Loading saved comparisons...</p>
      </div>
    );
  }

  // Unauthorized View
  if (!session) {
    return (
      <div className="flex flex-1 bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 p-16 text-center max-w-xl">
            <div className="rounded-full bg-slate-900 border border-slate-800 p-5 text-indigo-400 mb-6">
              <Lock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Access Restricted</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Log in or sign up to save college comparisons and view them on this dashboard.
            </p>
            <Link
              href="/login"
              className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition duration-200"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Comparisons</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Access and re-evaluate side-by-side matrices of colleges you previously compared.
          </p>
        </div>

        {/* Comparisons list */}
        {comparisons.length > 0 ? (
          <div className="space-y-6">
            {comparisons.map((comp) => (
              <div
                key={comp.id}
                onClick={() => handleOpenComparison(comp)}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-sm cursor-pointer hover:border-slate-800 hover:bg-slate-950/80 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                {/* College List Row */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-3">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Saved on {new Date(comp.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {comp.colleges.map((college, index) => (
                      <React.Fragment key={college.id}>
                        <div className="flex items-center space-x-3 max-w-xs">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
                            <img
                              src={college.image}
                              alt={college.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{college.name}</h4>
                            <p className="text-[10px] text-indigo-400 font-semibold">{college.rating.toFixed(1)} ★ • {college.location.split(",")[0]}</p>
                          </div>
                        </div>
                        {index < comp.colleges.length - 1 && (
                          <span className="hidden sm:inline text-xs font-bold text-slate-700">VS</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={(e) => handleDeleteComparison(comp.id, e)}
                    disabled={isDeleting === comp.id}
                    className="rounded-xl border border-slate-900 bg-slate-950 px-3.5 py-3.5 text-slate-400 hover:bg-red-950/30 hover:border-red-500/20 hover:text-red-400 transition"
                    title="Delete Comparison"
                  >
                    {isDeleting === comp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenComparison(comp)}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-5 py-3.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                  >
                    <span>Open Matrix</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 p-16 text-center max-w-xl mx-auto">
            <div className="rounded-full bg-slate-900 border border-slate-800 p-5 text-indigo-400 mb-6">
              <GitCompare className="h-10 w-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">No saved comparisons</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              You haven't saved any comparison matrices yet. Head over to our Compare Tool to compare and save.
            </p>
            <Link
              href="/compare"
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition duration-200"
            >
              Go to Compare
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
