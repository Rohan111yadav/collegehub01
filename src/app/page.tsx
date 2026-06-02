"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, GraduationCap, GitCompare, Bookmark, Award, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const features = [
    {
      icon: GraduationCap,
      title: "Extensive Directory",
      desc: "Explore details of India's top engineering and technical institutions, including courses and fees.",
    },
    {
      icon: GitCompare,
      title: "Compare side-by-side",
      desc: "Compare up to 3 colleges on parameters like fees, average packages, location, and rating.",
    },
    {
      icon: Bookmark,
      title: "Save Favorites",
      desc: "Create an account to bookmark colleges you are interested in and view them anytime.",
    },
  ];

  const stats = [
    { label: "Partner Colleges", value: "15+", icon: Award },
    { label: "Verified Reviews", value: "100%", icon: ShieldCheck },
    { label: "Avg Placement Package", value: "14.2 LPA", icon: TrendingUp },
    { label: "Happy Students", value: "10k+", icon: Users },
  ];

  return (
    <div className="flex flex-col flex-1 bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-6">
              <span>🚀 Premium Discovery Platform</span>
            </div>
            
            {/* Title */}
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
              Find Your Perfect College Match
            </h1>
            
            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
              Discover and compare top engineering universities by fees, placement records, academic courses, and student reviews. Empowering students to make informed decisions.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="mt-10 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by college name, city, courses..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 py-4 pl-12 pr-32 text-sm text-white placeholder-slate-500 shadow-2xl shadow-indigo-500/5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
                >
                  Find Colleges
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/colleges"
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition-all duration-200"
              >
                Browse All
              </Link>
              <Link
                href="/compare"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
              >
                Compare Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-900 bg-slate-950/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center p-6 rounded-2xl border border-slate-900/50 bg-slate-950/20 text-center">
                  <div className="rounded-xl bg-slate-900 p-3 text-indigo-400 mb-4 border border-slate-800/40">
                    <StatIcon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                  <span className="mt-1 text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
              Powerful tools to shape your path
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Evaluating options is easier when you have all metrics, comparison matrices, and bookmarks at your disposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const FeatIcon = feat.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-900 bg-slate-950/40 p-8 hover:border-slate-800 transition-colors duration-200">
                  <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 p-3 text-indigo-400 w-fit mb-6">
                    <FeatIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
