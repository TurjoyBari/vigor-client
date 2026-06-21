"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DataTable from "@/components/dashboard/ui/DataTable";
import Modal from "@/components/dashboard/ui/Modal";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { dashboardClasses, DASHBOARD_ANIMATION } from "@/lib/dashboard/theme";

async function fetchBookedClasses() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "bc-1",
      className: "HIIT Power Hour",
      trainerName: "Marcus Reed",
      schedule: "Mon, Wed, Fri · 7:00 AM",
      category: "HIIT",
      difficulty: "Advanced",
      duration: "45 min",
      location: "Studio A",
      status: "confirmed",
    },
    {
      id: "bc-2",
      className: "Morning Yoga Flow",
      trainerName: "Sarah Chen",
      schedule: "Tue, Thu · 6:30 AM",
      category: "Yoga",
      difficulty: "Beginner",
      duration: "60 min",
      location: "Studio B",
      status: "confirmed",
    },
    {
      id: "bc-3",
      className: "Strength Foundations",
      trainerName: "Alex Johnson",
      schedule: "Sat · 9:00 AM",
      category: "Strength",
      difficulty: "Intermediate",
      duration: "50 min",
      location: "Weight Room",
      status: "confirmed",
    },
    {
      id: "bc-4",
      className: "Spin & Burn",
      trainerName: "Emily Torres",
      schedule: "Sun · 8:00 AM",
      category: "Cycling",
      difficulty: "Intermediate",
      duration: "40 min",
      location: "Cycle Studio",
      status: "waitlisted",
    },
  ];
}

export default function UserBookedClassesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchBookedClasses()
      .then((data) => {
        if (mounted) setClasses(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "className",
        label: "Class Name",
        render: (row) => (
          <span className="font-semibold text-white">{row.className}</span>
        ),
      },
      {
        key: "trainerName",
        label: "Trainer Name",
      },
      {
        key: "schedule",
        label: "Schedule",
        render: (row) => (
          <span className="text-on-surface-variant">{row.schedule}</span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <button
            type="button"
            className={dashboardClasses.btnSecondary}
            onClick={() => {
              setSelectedClass(row);
              setDetailsOpen(true);
            }}
          >
            View Details
          </button>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <>
      <motion.div
        className="space-y-6 md:space-y-8"
        initial={DASHBOARD_ANIMATION.fadeIn.initial}
        animate={DASHBOARD_ANIMATION.fadeIn.animate}
        transition={DASHBOARD_ANIMATION.fadeIn.transition}
      >
        <header>
          <h2 className={dashboardClasses.pageTitle}>Booked Classes</h2>
          <p className={dashboardClasses.pageSubtitle}>
            View and manage all classes you have enrolled in.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={classes}
          emptyPreset="classes"
          emptyActionHref="/classes"
          emptyActionLabel="Browse Classes"
          rowKey="id"
        />
      </motion.div>

      <Modal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedClass(null);
        }}
        title={selectedClass?.className || "Class Details"}
        description="Your booking information"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              className={dashboardClasses.btnSecondary}
            >
              Close
            </button>
            <Link href="/classes" className={dashboardClasses.btnPrimary}>
              Browse More Classes
            </Link>
          </>
        }
      >
        {selectedClass && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{selectedClass.category}</Badge>
              <Badge variant="secondary">{selectedClass.difficulty}</Badge>
              <Badge
                status={
                  selectedClass.status === "waitlisted" ? "pending" : "approved"
                }
              />
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Trainer
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedClass.trainerName}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Schedule
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedClass.schedule}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Duration
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedClass.duration}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Location
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedClass.location}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}
