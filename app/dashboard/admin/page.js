"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Persons,
  LayoutList,
  Calendar,
  CreditCard,
  ChartLine,
  Shield,
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

function AdminAvatar({ user, size = 88 }) {
  if (
    user?.image &&
    !user.image.startsWith("blob:") &&
    !user.image.startsWith("data:")
  ) {
    return (
      <Image
        src={user.image}
        alt={user.name || "Admin"}
        width={size}
        height={size}
        className="rounded-2xl object-cover border-2 border-[#FF6B00]/40 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
      />
    );
  }

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "Admin"}
        className="rounded-2xl object-cover border-2 border-[#FF6B00]/40 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-2xl border-2 border-[#FF6B00]/40 bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] font-anybody font-black text-2xl shadow-[0_0_20px_rgba(255,107,0,0.2)]"
      style={{ width: size, height: size }}
    >
      {(user?.name || "A").charAt(0).toUpperCase()}
    </div>
  );
}

async function fetchAdminOverview() {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    stats: {
      totalUsers: 2847,
      totalClasses: 156,
      totalBookedClasses: 8934,
      revenue: "$48,290",
    },
    revenueChart: [
      { label: "Jan", value: 3200 },
      { label: "Feb", value: 4100 },
      { label: "Mar", value: 5800 },
      { label: "Apr", value: 6200 },
      { label: "May", value: 7400 },
      { label: "Jun", value: 8900 },
    ],
    userGrowthChart: [
      { label: "Jan", value: 120 },
      { label: "Feb", value: 185 },
      { label: "Mar", value: 240 },
      { label: "Apr", value: 310 },
      { label: "May", value: 420 },
      { label: "Jun", value: 510 },
    ],
    platformHealth: [
      { label: "Active trainers", value: "42" },
      { label: "Pending applications", value: "8" },
      { label: "Classes awaiting approval", value: "5" },
    ],
  };
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchAdminOverview()
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

  const { stats, revenueChart, userGrowthChart, platformHealth } = overview;

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      initial="initial"
      animate="animate"
      variants={DASHBOARD_ANIMATION.staggerContainer}
    >
      <motion.header variants={DASHBOARD_ANIMATION.fadeIn}>
        <h2 className={dashboardClasses.pageTitle}>Admin Overview</h2>
        <p className={dashboardClasses.pageSubtitle}>
          Platform analytics, user growth, and revenue performance at a glance.
        </p>
      </motion.header>

      <motion.div
        className={dashboardClasses.gridStats}
        variants={DASHBOARD_ANIMATION.fadeIn}
      >
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Persons}
          accent="primary"
          index={0}
          trend={{ value: 18, label: "vs last month" }}
        />
        <StatsCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={LayoutList}
          accent="secondary"
          index={1}
          trend={{ value: 9, label: "new this month" }}
        />
        <StatsCard
          title="Total Booked Classes"
          value={stats.totalBookedClasses.toLocaleString()}
          icon={Calendar}
          accent="accent"
          index={2}
          trend={{ value: 24, label: "booking rate up" }}
        />
        <StatsCard
          title="Revenue"
          value={stats.revenue}
          icon={CreditCard}
          accent="success"
          index={3}
          trend={{ value: 31, label: "vs last quarter" }}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Admin profile card */}
        <motion.article
          className={cn(dashboardClasses.glassCard, "p-6 md:p-8 xl:col-span-1")}
          variants={DASHBOARD_ANIMATION.fadeIn}
        >
          <p className={dashboardClasses.sectionTitle}>Admin Profile</p>

          <div className="mt-5 flex flex-col items-center text-center">
            <AdminAvatar user={user} />

            <h3 className="mt-4 font-anybody text-xl font-bold text-white">
              {user?.name || "Administrator"}
            </h3>
            <p className="mt-1 font-hanken text-sm text-on-surface-variant truncate max-w-full">
              {user?.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge role="admin" dot />
              <Badge variant="accent" size="sm">
                <Icon icon={Shield} size={12} className="inline mr-1" />
                Full Access
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {platformHealth.map((item) => (
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

          <div className="mt-6 grid grid-cols-1 gap-2">
            <Link
              href="/dashboard/admin/manage-users"
              className={cn(dashboardClasses.btnSecondary, "w-full text-center")}
            >
              Manage Users
            </Link>
            <Link
              href="/dashboard/admin/applied-trainers"
              className={cn(dashboardClasses.btnPrimary, "w-full text-center")}
            >
              Review Applications
            </Link>
          </div>
        </motion.article>

        {/* Charts */}
        <motion.div
          className="xl:col-span-2 space-y-6"
          variants={DASHBOARD_ANIMATION.fadeIn}
        >
          <AnalyticsCard
            title="Revenue Chart"
            subtitle="Monthly platform revenue (USD)"
            type="line"
            data={revenueChart}
            icon={CreditCard}
            accent="primary"
          />

          <AnalyticsCard
            title="User Growth Chart"
            subtitle="New user registrations per month"
            type="bar"
            data={userGrowthChart}
            icon={ChartLine}
            accent="secondary"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
