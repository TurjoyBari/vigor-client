"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, CircleCheck, CircleXmark } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import DataTable from "@/components/dashboard/ui/DataTable";
import Modal from "@/components/dashboard/ui/Modal";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    experience: "4 years coaching HIIT and strength training at FitCore Gym. NASM certified.",
    specialty: "HIIT, Strength Training",
    status: "pending",
    submittedAt: "2026-06-15",
  },
  {
    id: "app-2",
    name: "Emily Torres",
    email: "emily@example.com",
    experience: "6 years teaching spin and cycling classes. ACE group fitness certified.",
    specialty: "Cycling",
    status: "pending",
    submittedAt: "2026-06-14",
  },
  {
    id: "app-3",
    name: "Jordan Smith",
    email: "jordan@example.com",
    experience: "2 years yoga instruction, 200-hour RYT certification.",
    specialty: "Yoga",
    status: "approved",
    submittedAt: "2026-06-10",
  },
  {
    id: "app-4",
    name: "Chris Morgan",
    email: "chris@example.com",
    experience: "1 year personal training experience.",
    specialty: "General Fitness",
    status: "rejected",
    submittedAt: "2026-06-08",
    adminFeedback: "Please gain more coaching experience and reapply with certifications.",
  },
];

async function fetchApplications() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_APPLICATIONS;
}

async function reviewApplication(id, decision, feedback = "") {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, id, decision, feedback };
}

export default function AdminAppliedTrainersPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchApplications()
      .then((data) => {
        if (mounted) setApplications(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openDetails = (app) => {
    setSelectedApp(app);
    setFeedback(app.adminFeedback || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApp(null);
    setFeedback("");
    setSubmitting(false);
  };

  const handleReview = async (decision) => {
    if (!selectedApp) return;

    if (decision === "rejected" && !feedback.trim()) {
      toast.error("Please provide feedback when rejecting an application.");
      return;
    }

    try {
      setSubmitting(true);
      await reviewApplication(selectedApp.id, decision, feedback.trim());

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? {
                ...app,
                status: decision,
                adminFeedback: decision === "rejected" ? feedback.trim() : app.adminFeedback,
              }
            : app
        )
      );

      toast.success(
        decision === "approved"
          ? `${selectedApp.name}'s application approved.`
          : `${selectedApp.name}'s application rejected.`
      );
      closeModal();
    } catch {
      toast.error("Failed to process application. Please try again.");
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        render: (row) => (
          <div>
            <span className="font-semibold text-white block">{row.name}</span>
            <span className="font-hanken text-xs text-on-surface-variant">{row.email}</span>
          </div>
        ),
      },
      {
        key: "experience",
        label: "Experience",
        render: (row) => (
          <span className="line-clamp-2 text-on-surface-variant text-sm max-w-xs">
            {row.experience}
          </span>
        ),
      },
      {
        key: "specialty",
        label: "Specialty",
        render: (row) => <Badge variant="secondary">{row.specialty}</Badge>,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <Badge status={row.status} dot />,
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <button
            type="button"
            className={cn(dashboardClasses.btnSecondary, "px-3 py-2 text-xs")}
            onClick={() => openDetails(row)}
          >
            <Icon icon={Eye} size={14} />
            Details
          </button>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  const isPending = selectedApp?.status === "pending";

  return (
    <>
      <motion.div
        className="space-y-6 md:space-y-8"
        initial={DASHBOARD_ANIMATION.fadeIn.initial}
        animate={DASHBOARD_ANIMATION.fadeIn.animate}
        transition={DASHBOARD_ANIMATION.fadeIn.transition}
      >
        <header>
          <h2 className={dashboardClasses.pageTitle}>Applied Trainers</h2>
          <p className={dashboardClasses.pageSubtitle}>
            Review trainer applications, provide feedback, and approve or reject candidates.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={applications}
          emptyPreset="default"
          emptyTitle="No applications"
          emptyDescription="There are no trainer applications to review."
          rowKey="id"
        />
      </motion.div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Application Details"
        description={selectedApp ? `${selectedApp.name} · ${selectedApp.specialty}` : ""}
        size="lg"
        footer={
          isPending ? (
            <>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className={dashboardClasses.btnSecondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReview("rejected")}
                disabled={submitting}
                className={dashboardClasses.btnDanger}
              >
                <Icon icon={CircleXmark} size={16} />
                {submitting ? "Processing..." : "Reject"}
              </button>
              <button
                type="button"
                onClick={() => handleReview("approved")}
                disabled={submitting}
                className={dashboardClasses.btnPrimary}
              >
                <Icon icon={CircleCheck} size={16} />
                {submitting ? "Processing..." : "Approve"}
              </button>
            </>
          ) : (
            <button type="button" onClick={closeModal} className={dashboardClasses.btnSecondary}>
              Close
            </button>
          )
        }
      >
        {selectedApp && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={selectedApp.status} dot size="lg" />
              <span className="font-hanken text-xs text-on-surface-variant">
                Submitted {selectedApp.submittedAt}
              </span>
            </div>

            <dl className="space-y-4">
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Applicant
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">{selectedApp.name}</dd>
                <dd className="font-hanken text-xs text-on-surface-variant">{selectedApp.email}</dd>
              </div>

              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Experience
                </dt>
                <dd className="mt-1 font-hanken text-sm text-on-surface leading-relaxed">
                  {selectedApp.experience}
                </dd>
              </div>

              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Specialty
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">{selectedApp.specialty}</dd>
              </div>
            </dl>

            <div className="space-y-2">
              <label
                htmlFor="adminFeedback"
                className="block font-geist-label text-label-bold text-on-surface"
              >
                Admin Feedback
                {isPending && (
                  <span className="text-on-surface-variant font-normal">
                    {" "}
                    (required for rejection)
                  </span>
                )}
              </label>
              <textarea
                id="adminFeedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={!isPending}
                placeholder={
                  isPending
                    ? "Provide constructive feedback if rejecting this application..."
                    : "No feedback provided"
                }
                className={cn(dashboardClasses.input, "resize-none min-h-[100px]")}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
