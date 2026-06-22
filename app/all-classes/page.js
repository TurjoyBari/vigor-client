"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Magnifier } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import ClassCard from "@/components/classes/ClassCard";
import publicApi, { unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const CATEGORIES = [
  "All",
  "HIIT",
  "Strength Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Cycling",
  "Boxing",
  "Mobility",
];

export default function AllClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "All") params.category = category;

      const response = await publicApi.classes.getApproved(params);
      const data = unwrap(response);
      setClasses(data?.classes || []);
    } catch {
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const resultLabel = useMemo(() => {
    if (loading) return "Loading classes...";
    return `${classes.length} class${classes.length === 1 ? "" : "es"} found`;
  }, [classes.length, loading]);

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.header
          className="mb-8 md:mb-12"
          initial={DASHBOARD_ANIMATION.fadeIn.initial}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={DASHBOARD_ANIMATION.fadeIn.transition}
        >
          <p className="font-geist-label text-label-sm uppercase tracking-[0.2em] text-secondary mb-3">
            Train With The Best
          </p>
          <h1 className="font-anybody text-3xl md:text-5xl font-black text-white italic tracking-tight">
            All Classes
          </h1>
          <p className="mt-3 font-hanken text-body-lg text-on-surface-variant max-w-2xl">
            Browse approved programs from elite VIGOR trainers. Filter by category
            or search by class name.
          </p>
        </motion.header>

        <motion.div
          className={cn(
            dashboardClasses.glassCard,
            "p-4 md:p-5 mb-8 flex flex-col lg:flex-row gap-4"
          )}
          initial={DASHBOARD_ANIMATION.fadeIn.initial}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: 0.05 }}
        >
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Icon
                icon={Magnifier}
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by class name..."
                className={cn(dashboardClasses.input, "pl-10")}
              />
            </div>
            <button type="submit" className={dashboardClasses.btnPrimary}>
              Search
            </button>
          </form>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(dashboardClasses.select, "lg:min-w-[220px]")}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </motion.div>

        <p className="mb-6 font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
          {resultLabel}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[20px] border border-primary-container/20 bg-surface-container/40 animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div
            className={cn(
              dashboardClasses.glassCard,
              "py-16 text-center px-6"
            )}
          >
            <p className="font-anybody text-xl font-bold text-white">No classes found</p>
            <p className="mt-2 font-hanken text-sm text-on-surface-variant">
              Try a different search term or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {classes.map((classItem, index) => (
              <ClassCard key={classItem.id} classItem={classItem} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
