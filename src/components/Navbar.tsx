"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCompare } from "@/context/CompareContext";
import { GraduationCap, Bookmark, GitCompare, LogOut, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { compareList } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/colleges", label: "Find Colleges", icon: GraduationCap },
    { href: "/compare", label: "Compare", icon: GitCompare, badge: compareList.length },
    { href: "/favorites", label: "Saved", icon: Bookmark, authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="h-6 w-6 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                CollegeHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => {
              if (link.authRequired && !session) return null;
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-slate-900 text-indigo-400 shadow-inner"
                      : "text-slate-300 hover:bg-slate-900/50 hover:text-white"
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Auth Actions */}
            <div className="ml-4 flex items-center border-l border-slate-800 pl-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span className="max-w-[120px] truncate text-xs font-medium text-slate-300">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center space-x-1.5 rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950 md:hidden transition-all duration-200">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navLinks.map((link) => {
              if (link.authRequired && !session) return null;
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-slate-900 text-indigo-400"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="mt-4 border-t border-slate-800 pt-4 pb-2">
              {session ? (
                <div className="px-3">
                  <p className="text-sm font-medium text-slate-400">Logged in as:</p>
                  <p className="truncate text-base font-semibold text-white">
                    {session.user.name || session.user.email}
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="mt-3 flex w-full items-center justify-center space-x-2 rounded-md bg-red-950/40 border border-red-500/30 px-3 py-2 text-base font-medium text-red-400 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-base font-semibold text-white shadow-md shadow-indigo-600/20"
                  >
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
