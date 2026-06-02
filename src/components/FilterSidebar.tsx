"use client";

import React from "react";
import { SlidersHorizontal, MapPin, CreditCard, Star, RefreshCw, Sparkles } from "lucide-react";

interface FilterSidebarProps {
  locations: string[];
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  minFees: number;
  setMinFees: (fees: number) => void;
  maxFees: number;
  setMaxFees: (fees: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onReset: () => void;
}

export default function FilterSidebar({
  locations,
  selectedLocation,
  setSelectedLocation,
  minFees,
  setMinFees,
  maxFees,
  setMaxFees,
  minRating,
  setMinRating,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-900 bg-slate-950 p-6 shadow-xl shadow-slate-950/50">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors duration-200"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {/* College Type */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Institution Type</span>
          </label>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {["All", "Public", "Private"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-lg py-2 text-xs font-semibold border transition-all duration-200 ${
                  selectedType === type
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-900/40 border-slate-900 text-slate-300 hover:bg-slate-900 hover:border-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location Dropdown */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            <span>Location</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="mt-2.5 w-full rounded-xl border border-slate-900 bg-slate-900/60 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Fees Range Inputs */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
            <span>Annual Fees Range (INR)</span>
          </label>
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 font-medium uppercase">Min Fees</span>
              <input
                type="number"
                value={minFees || ""}
                onChange={(e) => setMinFees(parseInt(e.target.value || "0", 10))}
                placeholder="Min"
                className="w-full rounded-lg border border-slate-900 bg-slate-900/60 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium uppercase">Max Fees</span>
              <input
                type="number"
                value={maxFees || ""}
                onChange={(e) => setMaxFees(parseInt(e.target.value || "0", 10))}
                placeholder="Max"
                className="w-full rounded-lg border border-slate-900 bg-slate-900/60 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Star className="h-3.5 w-3.5 text-indigo-400" />
            <span>Minimum Rating</span>
          </label>
          <div className="mt-2.5 flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/20 p-2.5">
            {[0, 4.0, 4.3, 4.5, 4.8].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setMinRating(rating)}
                className={`flex items-center space-x-0.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  minRating === rating
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                    : "bg-slate-900/40 border border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {rating === 0 ? (
                  <span>All</span>
                ) : (
                  <>
                    <span>{rating}</span>
                    <Star className="h-3 w-3 fill-current text-amber-500" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting controls */}
        <div className="border-t border-slate-900 pt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sort Results By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-2.5 w-full rounded-xl border border-slate-900 bg-slate-900/60 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Default Ranking</option>
            <option value="rating">Rating</option>
            <option value="fees">Annual Fees</option>
            <option value="placements">Average Placement</option>
            <option value="name">Name</option>
          </select>

          {sortBy && (
            <div className="mt-2.5 flex rounded-lg border border-slate-900 overflow-hidden bg-slate-900/20">
              <button
                type="button"
                onClick={() => setSortOrder("asc")}
                className={`flex-1 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  sortOrder === "asc"
                    ? "bg-slate-900 text-indigo-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Ascending
              </button>
              <button
                type="button"
                onClick={() => setSortOrder("desc")}
                className={`flex-1 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  sortOrder === "desc"
                    ? "bg-slate-900 text-indigo-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Descending
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
