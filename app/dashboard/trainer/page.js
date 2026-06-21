"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutList,
  Persons,
  ChartLine,
  ArrowRight,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import StatsCard from "@/components/dashboard/ui/StatsCard";
import AnalyticsCard from "@/components/dashboard/ui/AnalyticsCard";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function TrainerAvatar({ user, size = 88 }) {
  if (
    user?.image &&
    !user.image.startsWith("blob:") &&
    !user.image.startsWith("data:")
  ) {
    return (
      <Image
        src={user.image}
        alt={user.name || "Trainer"}
        width={size}
        height={size}
        className="rounded-2xl object-cover border-2 border-secondary/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
      />
    );
  }

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "Trainer"}
        className="rounded-2xl object-cover border-2 border-secondary/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-2xl border-2 border-secondary/40 bg-secondary/20 flex items-center justify-center text-secondary font-anybody font-black text-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)]"
      style={{ width: size, height: size }}
    >
      {(user?.name || "T").charAt(0).toUpperCase()}
    </div>
  );
}

async function fetchTrainerOverview() {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    stats: {
      totalClasses: 8,
      totalStudents: 124,
    },
    enrollmentChart: [
      { label: "Jan", value: 18 },
      { label: "Feb", value: 26 },
      { label: "Mar", value: 34 },
      { label: "Apr", value: 29 },
      { label: "May", value: 42 },
      { label: "Jun", value: 48 },
    ],
    recentActivity: [
      { label: "New enrollments this week", value: "+12" },
      { label: "Active classes", value: "6" },
      { label: "Avg. class rating", value: "4.8" },
    ],
  };
}

export default function TrainerDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchTrainerOverview()
      .then((data) => {
        if (mounted) setOverview(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  const { stats, enrollmentChart, recentActivity } = overview;

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      initial="initial"
      animate="animate"
      variants={DASHBOARD_ANIMATION.staggerContainer}
    >
      <motion.header variants={DASHBOARD_ANIMATION.fadeIn}>
        <h2 className={dashboardClasses.pageTitle}>
          Trainer Dashboard
        </h2>
        <p className={dashboardClasses.pageSubtitle}>
          Monitor your classes, student enrollments, and performance analytics.
        </p>
      </motion.header>

      <motion.div
        className={dashboardClasses.gridStats}
        variants={DASHBOARD_ANIMATION.fadeIn}
      >
        <StatsCard
          title="Total Classes Created"
          value={stats.totalClasses}
          icon={LayoutList}
          accent="primary"
          index={0}
          trend={{ value: 14, label: "vs last month" }}
        />
        <StatsCard
          title="Total Students Enrolled"
          value={stats.totalStudents}
          icon={Persons}
          accent="secondary"
          index={1}
          trend={{ value: 22, label: "growth this quarter" }}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trainer profile card */}
        <motion.article
          className={cn(dashboardClasses.glassCard, "p-6 md:p-8 xl:col-span-1")}
          variants={DASHBOARD_ANIMATION.fadeIn}
        >
          <p className={dashboardClasses.sectionTitle}>Trainer Profile</p>

          <div className="mt-5 flex flex-col items-center text-center">
            <TrainerAvatar user={user} />

            <h3 className="mt-4 font-anybody text-xl font-bold text-white">
              {user?.name || "Trainer"}
            </h3>
            <p className="mt-1 font-hanken text-sm text-on-surface-variant truncate max-w-full">
              {user?.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge role="trainer" dot />
              <Badge variant="success" size="sm">
                Verified
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-surface-container-low/60 border border-primary-container/15 px-4 py-3"
              >
                <span className="font-hanken text-xs text-on-surface-variant">
                  {item.label}
                </span>
                <span className="font-geist-label text-sm font-bold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/trainer/profile"
            className={cn(dashboardClasses.btnSecondary, "w-full mt-6")}
          >
            Edit Profile
          </Link>
        </motion.article>

        {/* Enrollment analytics */}
        <motion.div className="xl:col-span-2" variants={DASHBOARD_ANIMATION.fadeIn}>
          <AnalyticsCard
            title="Enrollment Analytics"
            subtitle="Monthly student enrollments across your classes"
            type="bar"
            data={enrollmentChart}
            icon={ChartLine}
            accent="secondary"
            footer={
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-hanken text-sm text-on-surface-variant">
                  Peak enrollment in June with 48 new students.
                </p>
                <Link
                  href="/dashboard/trainer/my-classes"
                  className={cn(dashboardClasses.btnPrimary, "inline-flex shrink-0")}
                >
                  Manage Classes
                  <Icon icon={ArrowRight} size={16} />
                </Link>
              </div>
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
