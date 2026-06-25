"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutList } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import ClassCard from "@/components/classes/ClassCard";
import publicApi, { unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

export default function EliteTrainingLabs() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicApi.classes.getFeatured();
      const data = unwrap(response);
      setClasses(data?.classes || []);
    } catch {
      setClasses([]);
      setError("Unable to load featured classes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <section className="bg-surface py-section-gap relative">
      <div className="slant-separator absolute top-0 left-0 w-full z-0" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <motion.header
          className="mb-10 md:mb-12"
          initial={false}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={DASHBOARD_ANIMATION.fadeIn.transition}
        >
          <h2 className="font-anybody text-headline-lg font-black italic text-primary uppercase">
            Elite Training Labs
          </h2>
          <p className="text-on-surface-variant font-hanken text-body-md mt-2 max-w-2xl">
            Top-rated programs from VIGOR trainers — ranked by community bookings.
          </p>
        </motion.header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[20px] border border-primary-container/20 bg-surface-container/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div
            className={cn(
              dashboardClasses.glassCard,
              "py-14 text-center px-6 space-y-4"
            )}
          >
            <p className="font-hanken text-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={fetchFeatured}
              className={cn(dashboardClasses.btnSecondary, "inline-flex")}
            >
              Try Again
            </button>
          </div>
        ) : classes.length === 0 ? (
          <div
            className={cn(
              dashboardClasses.glassCard,
              "py-14 text-center px-6"
            )}
          >
            <Icon
              icon={LayoutList}
              size={40}
              className="text-on-surface-variant/40 mx-auto mb-4"
            />
            <p className="font-anybody text-xl font-bold text-white">
              No featured classes yet
            </p>
            <p className="mt-2 font-hanken text-sm text-on-surface-variant">
              Approved classes with bookings will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {classes.map((classItem, index) => (
              <ClassCard key={classItem.id} classItem={classItem} index={index} />
            ))}
          </div>
        )}

        <motion.div
          className="flex justify-center mt-10 md:mt-12"
          initial={false}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: 0.1 }}
        >
          <Link
            href="/all-classes"
            className={cn(dashboardClasses.btnPrimary, "inline-flex px-8")}
          >
            View More Classes
            <Icon icon={ArrowRight} size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
