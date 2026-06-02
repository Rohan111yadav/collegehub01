"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { College } from "@/types";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import CollegeCard from "@/components/CollegeCard";
import EmptyState from "@/components/EmptyState";
import { SlidersHorizontal, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

function CollegesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  // Search/Filters states initial values from URL
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minFees, setMinFees] = useState(0);
  const [maxFees, setMaxFees] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [selectedType, setSelectedType] = useState("All");

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Data states
  const [colleges, setColleges] = useState<College[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL search query if it changes externally
  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    setQ(qParam);
  }, [searchParams]);

  // Fetch favorite college IDs if logged in
  const fetchFavorites = useCallback(async () => {
    if (!session) {
      setFavorites([]);
      return;
    }
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.colleges.map((c: College) => c.id));
      }
    } catch (err) {
      console.error("Failed to fetch favorites list", err);
    }
  }, [session]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Fetch colleges list
  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (q) queryParams.set("q", q);
      if (selectedLocation) queryParams.set("location", selectedLocation);
      if (minFees > 0) queryParams.set("minFees", minFees.toString());
      if (maxFees < 1000000) queryParams.set("maxFees", maxFees.toString());
      if (minRating > 0) queryParams.set("minRating", minRating.toString());
      if (selectedType && selectedType !== "All") queryParams.set("type", selectedType);
      if (sortBy) queryParams.set("sortBy", sortBy);
      if (sortBy) queryParams.set("sortOrder", sortOrder);
      queryParams.set("page", page.toString());
      queryParams.set("limit", "6");

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
        setTotalPages(data.pagination.totalPages);
        if (data.locations) {
          setLocations(data.locations);
        }
      }
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    } finally {
      setIsLoading(false);
    }
  }, [q, selectedLocation, minFees, maxFees, minRating, selectedType, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Reset filters
  const handleResetFilters = () => {
    setQ("");
    setSelectedLocation("");
    setMinFees(0);
    setMaxFees(1000000);
    setMinRating(0);
    setSelectedType("All");
    setSortBy("");
    setSortOrder("desc");
    setPage(1);
    router.replace("/colleges");
  };

  const handleFavoriteChangeInList = (id: string, isFav: boolean) => {
    if (isFav) {
      setFavorites((prev) => [...prev, id]);
    } else {
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    }
  };

  return (
    <div className="flex-1 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Discover Colleges</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Explore and filter colleges matching your financial, location, and placement preferences.
          </p>
        </div>

        {/* Search Bar Row */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1">
            <SearchBar value={q} onChange={(val) => { setQ(val); setPage(1); }} />
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-900 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-slate-300 md:hidden hover:bg-slate-900/60 transition"
          >
            <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-400" />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile Filters Drawer/Modal */}
        {isMobileFilterOpen && (
          <div className="mb-6 md:hidden">
            <FilterSidebar
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={(loc) => { setSelectedLocation(loc); setPage(1); }}
              minFees={minFees}
              setMinFees={(fees) => { setMinFees(fees); setPage(1); }}
              maxFees={maxFees}
              setMaxFees={(fees) => { setMaxFees(fees); setPage(1); }}
              minRating={minRating}
              setMinRating={(rating) => { setMinRating(rating); setPage(1); }}
              selectedType={selectedType}
              setSelectedType={(type) => { setSelectedType(type); setPage(1); }}
              sortBy={sortBy}
              setSortBy={(field) => { setSortBy(field); setPage(1); }}
              sortOrder={sortOrder}
              setSortOrder={(order) => { setSortOrder(order); setPage(1); }}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Main Grid: Left Filters, Right Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <FilterSidebar
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={(loc) => { setSelectedLocation(loc); setPage(1); }}
              minFees={minFees}
              setMinFees={(fees) => { setMinFees(fees); setPage(1); }}
              maxFees={maxFees}
              setMaxFees={(fees) => { setMaxFees(fees); setPage(1); }}
              minRating={minRating}
              setMinRating={(rating) => { setMinRating(rating); setPage(1); }}
              selectedType={selectedType}
              setSelectedType={(type) => { setSelectedType(type); setPage(1); }}
              sortBy={sortBy}
              setSortBy={(field) => { setSortBy(field); setPage(1); }}
              sortOrder={sortOrder}
              setSortOrder={(order) => { setSortOrder(order); setPage(1); }}
              onReset={handleResetFilters}
            />
          </div>

          {/* Cards Display Grid */}
          <div className="md:col-span-3 flex flex-col justify-between min-h-[500px]">
            {isLoading ? (
              <div className="flex flex-1 flex-col items-center justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <p className="mt-4 text-sm text-slate-400">Loading colleges...</p>
              </div>
            ) : colleges.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      initialFavorited={favorites.includes(college.id)}
                      onFavoriteChange={handleFavoriteChangeInList}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center space-x-2 border-t border-slate-900 pt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center space-x-1.5 rounded-lg border border-slate-900 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Prev</span>
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                              page === pageNum
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center space-x-1.5 rounded-lg border border-slate-900 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-12">
                <EmptyState onAction={handleResetFilters} actionText="Clear Filters" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-24 text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="mt-4 text-sm">Loading colleges directory...</p>
        </div>
      }
    >
      <CollegesListContent />
    </Suspense>
  );
}
