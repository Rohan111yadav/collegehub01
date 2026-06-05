"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { College } from "@/types";
import CollegeCard from "@/components/CollegeCard";
import EmptyState from "@/components/EmptyState";
import { Bookmark, Lock, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const fetchRecentlyViewed = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/recently-viewed");
      if (res.ok) {
        const data = await res.json();
        setRecentlyViewed(data.colleges);
      }
    } catch (err) {
      console.error("Failed to fetch recently viewed:", err);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchFavorites();
      fetchRecentlyViewed();
    } else {
      setIsLoading(false);
    }
  }, [session, fetchFavorites, fetchRecentlyViewed]);

  // Handle local state update when user toggles favorite off
  const handleFavoriteChange = (id: string, isFav: boolean) => {
    if (!isFav) {
      setColleges((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (status === "loading" || (session && isLoading)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-20 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm">Loading saved colleges...</p>
      </div>
    );
  }

  // Not Authenticated view
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
              Log in or sign up to bookmark colleges and access your personalized list of saved favorites.
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Colleges</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            A personalized space containing institutions you bookmarked.
          </p>
        </div>

        {/* Saved List Grid */}
        {colleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                initialFavorited={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 p-16 text-center max-w-xl mx-auto">
            <div className="rounded-full bg-slate-900 border border-slate-800 p-5 text-indigo-400 mb-6">
              <Bookmark className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">No saved colleges</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Your bookmarks list is empty. Browse through colleges and save the ones you are interested in.
            </p>
            <Link
              href="/colleges"
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition duration-200"
            >
              Find Colleges
            </Link>
          </div>
        )}
        {/* Recently Viewed Colleges Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 border-t border-slate-900 pt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Recently Viewed</h2>
              <p className="mt-1.5 text-sm text-slate-400">
                Quick-access to the institutions you recently explored.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.map((college) => (
                <CollegeCard
                  key={`recent-${college.id}`}
                  college={college}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
