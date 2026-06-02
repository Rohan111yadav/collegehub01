"use client";

import React from "react";
import Link from "next/link";
import { College } from "@/types";
import { useCompare } from "@/context/CompareContext";
import { Star, X, MapPin, Calendar, Shield, DollarSign, Briefcase, ExternalLink } from "lucide-react";

interface CompareTableProps {
  colleges: College[];
}

export default function CompareTable({ colleges }: CompareTableProps) {
  const { removeFromCompare } = useCompare();

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/yr`;
    }
    return `₹${amount.toLocaleString()}/yr`;
  };

  if (colleges.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-900 bg-slate-950 p-12 text-center">
        <p className="text-slate-400">No colleges selected for comparison.</p>
        <Link
          href="/colleges"
          className="mt-4 inline-flex items-center space-x-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-200"
        >
          <span>Find Colleges to Compare</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-sm shadow-xl">
      <div className="min-w-[768px]">
        {/* Table Head / Cards */}
        <div className="grid grid-cols-4 border-b border-slate-900 bg-slate-950 p-6">
          <div className="flex flex-col justify-center pr-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Comparing Colleges</h3>
            <p className="mt-1 text-xs text-slate-400">
              Side-by-side analysis of key metrics and details.
            </p>
          </div>
          {colleges.map((college) => (
            <div key={college.id} className="relative flex flex-col px-4 border-l border-slate-900">
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute top-0 right-2 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-slate-400 hover:bg-red-950/40 hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                <img
                  src={college.image}
                  alt={college.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-3">
                <span className="rounded bg-indigo-600/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                  {college.type}
                </span>
                <h4 className="mt-1.5 line-clamp-2 text-sm font-bold text-white leading-snug">
                  {college.name}
                </h4>
              </div>
            </div>
          ))}
          {/* Fill remaining slots to maintain layout */}
          {Array.from({ length: 3 - colleges.length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex flex-col items-center justify-center border-l border-slate-900 p-6 text-center text-slate-600 select-none">
              <div className="rounded-full border border-dashed border-slate-800 p-4 mb-2">
                <X className="h-6 w-6 text-slate-800" />
              </div>
              <p className="text-xs">Add another college</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-900/60">
          {/* Location */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span>Location</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 text-sm font-medium text-slate-200">
                {college.location}
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Rating */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Rating</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 flex items-center space-x-1.5">
                <span className="text-sm font-bold text-white">{college.rating.toFixed(1)}</span>
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${
                        idx < Math.round(college.rating) ? "fill-current" : "text-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Annual Fees */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>Annual Fees</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 text-sm font-bold text-slate-100">
                {formatFees(college.fees)}
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Average Placements */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Briefcase className="h-4 w-4 text-blue-500" />
              <span>Avg Placement</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 text-sm font-bold text-slate-100">
                {college.placements.toFixed(2)} LPA
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Established Year */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>Established</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 text-sm font-medium text-slate-300">
                {college.establishedYear} ({new Date().getFullYear() - college.establishedYear} yrs old)
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Accreditation */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>Accreditation</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 text-sm font-semibold text-indigo-400">
                {college.accreditation}
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Courses Offered */}
          <div className="grid grid-cols-4 p-5 items-start">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 pt-1">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>Courses</span>
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4 flex flex-wrap gap-1.5">
                {(college.courses as string[]).map((course, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300"
                  >
                    {course}
                  </span>
                ))}
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>

          {/* Action Link */}
          <div className="grid grid-cols-4 p-5 items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Details
            </div>
            {colleges.map((college) => (
              <div key={college.id} className="px-4">
                <Link
                  href={`/college/${college.id}`}
                  className="inline-flex items-center space-x-1 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all duration-200"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, i) => (
              <div key={`empty-${i}`} className="px-4 text-sm text-slate-600 font-light">-</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
