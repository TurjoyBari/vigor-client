"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Magnifier, ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import ClassCard from "@/components/classes/ClassCard";
import publicApi, { unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 400;

const FILTER_CATEGORIES = [
  "HIIT",
  "Strength Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Cycling",
  "Boxing",
  "Mobility",
];

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export default function AllClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);

    console.log(search, selectedCategories, currentPage);

    try {
      const params = {
        page: currentPage,
        limit: PAGE_SIZE,
      };

      if (search) params.search = search;
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(",");
      }

      const response = await publicApi.classes.getApproved(params);
      const data = unwrap(response);

      setClasses(data?.classes || []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    } catch (error) {
      console.error("Failed to load classes:", error);
      setClasses([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, currentPage]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
    setCurrentPage(1);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const resultLabel = useMemo(() => {
    if (loading) return "Loading classes...";
    return `${total} class${total === 1 ? "" : "es"} found`;
  }, [total, loading]);

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
          className={cn(dashboardClasses.glassCard, "p-4 md:p-5 mb-6 space-y-4")}
          initial={DASHBOARD_ANIMATION.fadeIn.initial}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: 0.05 }}
        >
          <div className="relative">
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
              className={cn(dashboardClasses.input, "pl-10 w-full")}
              aria-label="Search classes by name"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={clearCategories}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-geist-label font-semibold border transition",
                selectedCategories.length === 0
                  ? "bg-primary-container text-on-primary-container border-primary-container"
                  : "border-primary-container/30 text-on-surface-variant hover:text-white"
              )}
            >
              All Categories
            </button>
            {FILTER_CATEGORIES.map((category) => {
              const active = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-geist-label font-semibold border transition",
                    active
                      ? "bg-secondary/20 text-secondary border-secondary/40"
                      : "border-primary-container/30 text-on-surface-variant hover:text-white hover:border-primary-container/50"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </motion.div>

        <p className="mb-6 font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
          {resultLabel}
          {!loading && totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[20px] border border-primary-container/20 bg-surface-container/40 animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className={cn(dashboardClasses.glassCard, "py-16 text-center px-6")}>
            <p className="font-anybody text-xl font-bold text-white">No classes found</p>
            <p className="mt-2 font-hanken text-sm text-on-surface-variant">
              Try changing search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {classes.map((classItem, index) => (
                <ClassCard key={classItem.id} classItem={classItem} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Classes pagination"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage <= 1}
                  className={cn(
                    dashboardClasses.btnSecondary,
                    "px-3 py-2 text-xs",
                    currentPage <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon icon={ChevronLeft} size={16} />
                  Prev
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[2.25rem] rounded-lg px-3 py-2 text-xs font-geist-label font-semibold border transition",
                      page === currentPage
                        ? "bg-primary-container text-on-primary-container border-primary-container"
                        : "border-primary-container/30 text-on-surface-variant hover:text-white"
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className={cn(
                    dashboardClasses.btnSecondary,
                    "px-3 py-2 text-xs",
                    currentPage >= totalPages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Next
                  <Icon icon={ChevronRight} size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
