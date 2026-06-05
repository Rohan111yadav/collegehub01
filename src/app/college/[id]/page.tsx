"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCompare } from "@/context/CompareContext";
import { College, Review } from "@/types";
import { Star, MapPin, DollarSign, Briefcase, Bookmark, GitCompare, ExternalLink, Calendar, Shield, Globe, Award, ChevronLeft, Loader2, MessageSquare, Plus, GraduationCap } from "lucide-react";

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // For adding a new review (bonus/usability feature)
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const checkFavoriteStatus = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        const isFav = data.colleges.some((c: College) => c.id === id);
        setIsFavorited(isFav);
      }
    } catch (err) {
      console.error("Failed to fetch favorite status:", err);
    }
  }, [session, id]);

  const fetchCollege = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/colleges/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data);
      }
    } catch (err) {
      console.error("Failed to fetch college details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollege();
    checkFavoriteStatus();
  }, [fetchCollege, checkFavoriteStatus]);

  // Track recently viewed college
  useEffect(() => {
    if (session && college) {
      fetch("/api/recently-viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      }).catch((err) => {
        console.error("Failed to track recently viewed college:", err);
      });
    }
  }, [session, college]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-24 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm">Loading college details...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-24 text-slate-400">
        <p className="text-lg">College details could not be found.</p>
        <Link href="/colleges" className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          Back to Find Colleges
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(college.id);

  const handleFavoriteToggle = async () => {
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
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) {
      alert("Please fill out all fields.");
      return;
    }

    const reviewObj: Review = {
      author: newAuthor,
      rating: newRating,
      comment: newComment,
    };

    // Since we don't have a specific POST review API, we can simulate updating local state
    // In a full implementation, we'd save this to DB. Let's update local state so the user sees it instantly.
    const updatedReviews = [reviewObj, ...(college.reviews || [])];
    setCollege({
      ...college,
      reviews: updatedReviews,
    });

    // Reset Form
    setNewAuthor("");
    setNewRating(5);
    setNewComment("");
    setShowReviewForm(false);
    alert("Thank you for your review! It has been posted.");
  };

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="flex-1 bg-slate-950 pb-20">
      {/* Back Button and Top Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/colleges"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Discovery</span>
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-slate-900">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {college.type}
              </span>
              <span className="rounded bg-slate-900/90 border border-slate-800 px-3 py-1 text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <span>{college.accreditation}</span>
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {college.name}
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4.5 w-4.5 text-indigo-400" />
                <span>{college.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4.5 w-4.5 text-indigo-400" />
                <span>Established {college.establishedYear}</span>
              </div>
              <div className="flex items-center space-x-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500 border border-amber-500/20">
                <span>{college.rating.toFixed(1)}</span>
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content columns */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Overview, Courses, Reviews) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-900 pb-4">
                About the Institution
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {college.description}
              </p>
            </div>

            {/* Courses Offered */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-900 pb-4">
                Courses Offered
              </h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(college.courses as string[]).map((course, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 rounded-xl border border-slate-900/50 bg-slate-950/50 p-4 transition hover:border-slate-800"
                  >
                    <div className="rounded-lg bg-indigo-600/10 border border-indigo-500/20 p-2 text-indigo-400 shrink-0">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{course}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">FULL-TIME DEGREE</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Records */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-900 pb-4">
                Placement & Packages
              </h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="rounded-xl border border-slate-900/60 bg-slate-950/50 p-5">
                  <div className="rounded-full bg-blue-500/10 text-blue-400 p-3 mx-auto w-fit mb-3">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-black text-white">{college.placements.toFixed(2)} LPA</p>
                  <p className="mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">Average Salary</p>
                </div>
                
                <div className="rounded-xl border border-slate-900/60 bg-slate-950/50 p-5">
                  <div className="rounded-full bg-emerald-500/10 text-emerald-400 p-3 mx-auto w-fit mb-3">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-black text-white">{formatFees(college.fees)}</p>
                  <p className="mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">Annual Tuition Fees</p>
                </div>

                <div className="rounded-xl border border-slate-900/60 bg-slate-950/50 p-5">
                  <div className="rounded-full bg-indigo-500/10 text-indigo-400 p-3 mx-auto w-fit mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-black text-white">{college.type}</p>
                  <p className="mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">Management Type</p>
                </div>
              </div>
            </div>

            {/* Student Reviews */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                  <span>Student Reviews</span>
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Write Review</span>
                </button>
              </div>

              {/* Review Input Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="mt-6 rounded-xl border border-slate-900 bg-slate-950/50 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Share Your Review</h3>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg border border-slate-900 bg-slate-900/60 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Rating (1 to 5 Stars)</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
                      className="w-full rounded-lg border border-slate-900 bg-slate-900/60 py-2 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Very Poor)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your Comments</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder="What is your experience in this college? Share faculty, placement and hostel details..."
                      className="w-full rounded-lg border border-slate-900 bg-slate-900/60 py-2 px-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="mt-6 space-y-4">
                {(college.reviews as Review[]).map((rev, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-900/50 bg-slate-950/20 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">{rev.author}</p>
                      <div className="flex items-center space-x-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                        <span>{rev.rating}</span>
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-light">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Action Cards) */}
          <div className="space-y-6">
            
            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 shadow-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Actions</h3>
              
              <div className="mt-4 space-y-2.5">
                {/* Compare */}
                <button
                  onClick={handleCompareToggle}
                  className={`w-full flex items-center justify-center space-x-2 rounded-xl border py-3 text-xs font-bold transition duration-200 ${
                    inCompare
                      ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                      : "bg-slate-900/40 border-slate-900 text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <GitCompare className="h-4 w-4" />
                  <span>{inCompare ? "Compared (Remove)" : "Add to Compare"}</span>
                </button>

                {/* Favorite */}
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isSaving}
                  className={`w-full flex items-center justify-center space-x-2 rounded-xl border py-3 text-xs font-bold transition duration-200 ${
                    isFavorited
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-slate-900/40 border-slate-900 text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Bookmark className={`h-4.5 w-4.5 ${isFavorited ? "fill-current" : ""}`} />
                  <span>{isFavorited ? "Saved to Favorites" : "Save to Favorites"}</span>
                </button>

                {/* Visit Official Website */}
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition duration-200"
                >
                  <Globe className="h-4.5 w-4.5" />
                  <span>Visit Official Site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Fast Facts Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-2">Fast Facts</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Established</span>
                  <span className="text-slate-300 font-medium">{college.establishedYear}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Accreditation</span>
                  <span className="text-indigo-400 font-semibold">{college.accreditation}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-300 font-medium">{college.type}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Average Tuition</span>
                  <span className="text-slate-300 font-bold">{formatFees(college.fees)} / yr</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Avg Placement</span>
                  <span className="text-slate-300 font-bold">{college.placements.toFixed(2)} LPA</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
