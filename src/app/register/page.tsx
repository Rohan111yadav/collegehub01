"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Action states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // Register User
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // Auto sign-in upon successful register
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.replace("/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              CollegeHub
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join CollegeHub to save colleges and comparisons
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-10 rounded-2xl border border-slate-900 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-md">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start space-x-2.5 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-xs font-medium text-red-400">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full rounded-xl border border-slate-900 bg-slate-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  required
                  className="w-full rounded-xl border border-slate-900 bg-slate-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-900 bg-slate-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-900 bg-slate-900/40 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
