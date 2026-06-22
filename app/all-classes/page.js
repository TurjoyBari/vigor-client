"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutList, Persons, Clock, Search } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
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

const PLACEHOLDER_IMAGE = "/images/hero-strongest.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price) || 0);
}

function ClassCardImage({ src, alt }) {
  const isLocal =
    src &&
    !src.startsWith("blob:") &&
    !src.startsWith("data:") &&
    (src.startsWith("/") || src.startsWith("http"));

  if (isLocal && src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    );
  }

  if (isLocal) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <Image
      src={PLACEHOLDER_IMAGE}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
}

function ClassCard({ classItem, index }) {
  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "overflow-hidden group flex flex-col"
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-surface-container">
        <ClassCardImage src={classItem.image} alt={classItem.className} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-primary-container/90 px-2.5 py-1 text-[10px] font-geist-label font-bold uppercase tracking-wider text-on-primary-container">
          {classItem.category}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-[#0B1120]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-xs font-bold text-secondary">
          {formatPrice(classItem.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5 gap-4">
        <div className="space-y-2">
          <h3 className="font-anybody text-lg font-bold text-white line-clamp-2">
            {classItem.className}
          </h3>
          <p className="flex items-center gap-1.5 font-hanken text-sm text-on-surface-variant">
            <Icon icon={Persons} size={14} className="text-secondary shrink-0" />
            <span className="truncate">{classItem.trainer}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-geist-label text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Icon icon={Clock} size={14} className="text-primary" />
            {classItem.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon={LayoutList} size={14} className="text-primary" />
            {classItem.bookingCount ?? 0} booked
          </span>
        </div>

        <Link
          href={`/classes/${classItem.id}`}
          className={cn(dashboardClasses.btnPrimary, "w-full mt-auto text-center")}
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}

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
                icon={Search}
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
