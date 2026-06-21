"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Star, GraduationCap, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import StatsCard from "@/components/dashboard/ui/StatsCard";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { TRAINER_APPLICATION_STATUS } from "@/lib/dashboard/navConfig";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function UserAvatar({ user, size = 80 }) {
  if (
    user?.image &&
    !user.image.startsWith("blob:") &&
    !user.image.startsWith("data:")
  ) {
    return (
      <Image
        src={user.image}
        alt={user.name || "Profile"}
        width={size}
        height={size}
        className="rounded-2xl object-cover border-2 border-primary-container/40 shadow-lg"
      />
    );
  }

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile"}
        className="rounded-2xl object-cover border-2 border-primary-container/40 shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-2xl border-2 border-primary-container/40 bg-primary-container flex items-center justify-center text-on-primary-container font-anybody font-black text-2xl shadow-lg"
      style={{ width: size, height: size }}
    >
      {(user?.name || "U").charAt(0).toUpperCase()}
    </div>
  );
}

async function fetchUserOverview() {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    stats: {
      bookedClasses: 5,
      favorites: 3,
    },
    trainerApplication: {
      status: TRAINER_APPLICATION_STATUS.PENDING,
      experience: "3 years coaching HIIT and strength training",
      specialty: "HIIT, Strength Training",
      adminFeedback: "",
      submittedAt: "2026-06-15",
    },
  };
}

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchUserOverview()
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

  const { stats, trainerApplication } = overview;
  const isRejected =
    trainerApplication.status === TRAINER_APPLICATION_STATUS.REJECTED;
  const isApproved =
    trainerApplication.status === TRAINER_APPLICATION_STATUS.APPROVED;
  const isPending =
    trainerApplication.status === TRAINER_APPLICATION_STATUS.PENDING;
  const hasApplication =
    trainerApplication.status !== TRAINER_APPLICATION_STATUS.NONE;

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      initial="initial"
      animate="animate"
      variants={DASHBOARD_ANIMATION.staggerContainer}
    >
      <motion.header variants={DASHBOARD_ANIMATION.fadeIn}>
        <h2 className={dashboardClasses.pageTitle}>Welcome back, {user?.name?.split(" ")[0] || "Athlete"}</h2>
        <p className={dashboardClasses.pageSubtitle}>
          Track your classes, favorites, and trainer application status.
        </p>
      </motion.header>

      <motion.div
        className={dashboardClasses.gridStats}
        variants={DASHBOARD_ANIMATION.fadeIn}
      >
        <StatsCard
          title="Total Booked Classes"
          value={stats.bookedClasses}
          icon={Calendar}
          accent="primary"
          index={0}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatsCard
          title="Total Favorites"
          value={stats.favorites}
          icon={Star}
          accent="secondary"
          index={1}
          trend={{ value: 5, label: "saved classes" }}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile card */}
        <motion.article
          className={cn(dashboardClasses.glassCard, "p-6 md:p-8 xl:col-span-1")}
          variants={DASHBOARD_ANIMATION.fadeIn}
        >
          <p className={dashboardClasses.sectionTitle}>Profile</p>

          <div className="mt-5 flex flex-col items-center text-center">
            <UserAvatar user={user} size={88} />

            <h3 className="mt-4 font-anybody text-xl font-bold text-white">
              {user?.name || "Member"}
            </h3>
            <p className="mt-1 font-hanken text-sm text-on-surface-variant truncate max-w-full">
              {user?.email}
            </p>
            <div className="mt-3">
              <Badge role={user?.role || "user"} dot />
            </div>
          </div>

          <Link
            href="/dashboard/user/profile"
            className={cn(dashboardClasses.btnSecondary, "w-full mt-6")}
          >
            Edit Profile
          </Link>
        </motion.article>

        {/* Trainer application status */}
        <motion.article
          className={cn(dashboardClasses.glassCard, "p-6 md:p-8 xl:col-span-2")}
          variants={DASHBOARD_ANIMATION.fadeIn}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={dashboardClasses.sectionTitle}>Trainer Application</p>
              <h3 className="mt-2 font-anybody text-xl font-bold text-white">
                Application Status
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15">
              <Icon icon={GraduationCap} className="text-secondary" size={22} />
            </div>
          </div>

          {!hasApplication ? (
            <div className="mt-6 rounded-xl border border-dashed border-primary-container/25 bg-primary-container/5 p-6 text-center">
              <p className="font-hanken text-sm text-on-surface-variant">
                You have not applied to become a trainer yet.
              </p>
              <Link
                href="/dashboard/user/apply-trainer"
                className={cn(dashboardClasses.btnPrimary, "mt-4 inline-flex")}
              >
                Apply as Trainer
                <Icon icon={ArrowRight} size={18} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge status={trainerApplication.status} size="lg" dot />
                {trainerApplication.submittedAt && (
                  <span className="font-hanken text-xs text-on-surface-variant">
                    Submitted {trainerApplication.submittedAt}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                  <p className="font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Experience
                  </p>
                  <p className="mt-2 font-hanken text-sm text-on-surface">
                    {trainerApplication.experience}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                  <p className="font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Specialty
                  </p>
                  <p className="mt-2 font-hanken text-sm text-on-surface">
                    {trainerApplication.specialty}
                  </p>
                </div>
              </div>

              {isPending && (
                <div className="rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 p-4">
                  <p className="font-geist-label text-sm font-semibold text-[#F59E0B]">
                    Under Review
                  </p>
                  <p className="mt-1 font-hanken text-sm text-on-surface-variant">
                    Your application is being reviewed by our admin team. You will be
                    notified once a decision is made.
                  </p>
                </div>
              )}

              {isApproved && (
                <div className="rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/10 p-4">
                  <p className="font-geist-label text-sm font-semibold text-[#22C55E]">
                    Congratulations!
                  </p>
                  <p className="mt-1 font-hanken text-sm text-on-surface-variant">
                    Your trainer application has been approved. You can now access the
                    trainer dashboard.
                  </p>
                  <Link
                    href="/dashboard/trainer"
                    className={cn(dashboardClasses.btnPrimary, "mt-4 inline-flex")}
                  >
                    Go to Trainer Dashboard
                    <Icon icon={ArrowRight} size={18} />
                  </Link>
                </div>
              )}

              {isRejected && (
                <div className="rounded-xl border border-error/25 bg-error/10 p-4">
                  <p className="font-geist-label text-sm font-semibold text-error">
                    Application Rejected
                  </p>
                  <p className="mt-1 font-hanken text-sm text-on-surface-variant">
                    Unfortunately your application was not approved at this time.
                  </p>
                  {trainerApplication.adminFeedback && (
                    <div className="mt-3 rounded-lg bg-[#0B1120]/60 border border-error/20 p-3">
                      <p className="font-geist-label text-xs uppercase tracking-wider text-error/80">
                        Admin Feedback
                      </p>
                      <p className="mt-1 font-hanken text-sm text-on-surface">
                        {trainerApplication.adminFeedback}
                      </p>
                    </div>
                  )}
                  <Link
                    href="/dashboard/user/apply-trainer"
                    className={cn(dashboardClasses.btnSecondary, "mt-4 inline-flex")}
                  >
                    Reapply
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.article>
      </div>
    </motion.div>
  );
}
