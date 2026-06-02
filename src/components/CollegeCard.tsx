"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCompare } from "@/context/CompareContext";
import { College } from "@/types";
import { Star, MapPin, DollarSign, Briefcase, Bookmark, GitCompare, ExternalLink, Calendar, Shield } from "lucide-react";

interface CollegeCardProps {
  college: College;
  initialFavorited?: boolean;
  onFavoriteChange?: (id: string, isFavorited: boolean) => void;
}

export default function CollegeCard({
  college,
  initialFavorited = false,
  onFavoriteChange,
}: CollegeCardProps) {
  const { data: session } = useSession();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isSaving, setIsSaving] = useState(false);

  // Sync favorites if prop changes
  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const inCompare = isInCompare(college.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Please log in to save colleges to your favorites.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
        if (onFavoriteChange) {
          onFavoriteChange(college.id, data.favorited);
        }
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college);
    }
  };

  // Helper to format currency
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/yr`;
    }
    return `₹${amount.toLocaleString()}/yr`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-800 hover:bg-slate-950/80 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Top Banner & Save Button */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-indigo-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
            {college.type}
          </span>
          <span className="rounded-md bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
            <Shield className="h-3 w-3 text-indigo-400" />
            <span>{college.accreditation}</span>
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isSaving}
          className={`absolute top-3 right-3 rounded-xl p-2.5 backdrop-blur-md transition-all duration-300 border ${
            isFavorited
              ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40"
              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950 hover:text-white"
          }`}
        >
          <Bookmark className={`h-4.5 w-4.5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Main Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/college/${college.id}`}>
              <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                {college.name}
              </h3>
            </Link>
            <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>{college.location}</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="ml-3 flex items-center space-x-1 rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-500 border border-amber-500/20">
            <span>{college.rating.toFixed(1)}</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {college.description}
        </p>

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-900 py-3.5 text-slate-300">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-slate-900 p-1.5 text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Fees</p>
              <p className="text-xs font-semibold">{formatFees(college.fees)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-slate-900 p-1.5 text-indigo-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Avg Placement</p>
              <p className="text-xs font-semibold">{college.placements.toFixed(2)} LPA</p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 flex items-center gap-2">
          {/* Compare Button */}
          <button
            onClick={handleCompareToggle}
            className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
              inCompare
                ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                : "bg-slate-900/40 border-slate-900 text-slate-300 hover:bg-slate-900 hover:border-slate-800 hover:text-white"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>{inCompare ? "Compared" : "Compare"}</span>
          </button>

          {/* View Details Link */}
          <Link
            href={`/college/${college.id}`}
            className="flex items-center justify-center space-x-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-200"
          >
            <span>Details</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
