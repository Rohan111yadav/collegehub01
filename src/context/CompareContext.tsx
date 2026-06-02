"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { College } from "@/types";

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isInCompare: (collegeId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("collegehub_compare");
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing compare list from local storage", e);
      }
    }
  }, []);

  // Save to localStorage when list changes
  const saveList = (list: College[]) => {
    setCompareList(list);
    localStorage.setItem("collegehub_compare", JSON.stringify(list));
  };

  const addToCompare = (college: College) => {
    if (compareList.some((item) => item.id === college.id)) {
      return; // Already in compare
    }
    if (compareList.length >= 3) {
      alert("You can compare up to 3 colleges side-by-side.");
      return;
    }
    saveList([...compareList, college]);
  };

  const removeFromCompare = (collegeId: string) => {
    saveList(compareList.filter((item) => item.id !== collegeId));
  };

  const clearCompare = () => {
    saveList([]);
  };

  const isInCompare = (collegeId: string) => {
    return compareList.some((item) => item.id === collegeId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
