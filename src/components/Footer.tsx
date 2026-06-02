import React from "react";
import Link from "next/link";
import { GraduationCap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                CollegeHub
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-slate-400 leading-relaxed">
              Explore top universities, compare course fees, average placements packages, read reviews, and build your future. Your dream college is just one click away.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/colleges" className="text-sm hover:text-white transition-colors">
                  Find Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm hover:text-white transition-colors">
                  Compare Tools
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm hover:text-white transition-colors">
                  Saved Colleges
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Platform
            </h3>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Built with Next.js (App Router), Prisma, TailwindCSS, and PostgreSQL. Highly optimized and production-ready.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CollegeHub. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for students worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
