"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CircleCheck, CircleXmark, TrashBin } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import DataTable from "@/components/dashboard/ui/DataTable";
import Badge from "@/components/dashboard/ui/Badge";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const INITIAL_CLASSES = [
  {
    id: "c-1",
    className: "HIIT Power Hour",
    trainer: "Marcus Reed",
    status: "pending",
    category: "HIIT",
  },
  {
    id: "c-2",
    className: "Morning Yoga Flow",
    trainer: "Sarah Chen",
    status: "published",
    category: "Yoga",
  },
  {
    id: "c-3",
    className: "Spin & Burn",
    trainer: "Emily Torres",
    status: "pending",
    category: "Cycling",
  },
  {
    id: "c-4",
    className: "Strength Foundations",
    trainer: "Alex Johnson",
    status: "rejected",
    category: "Strength",
  },
  {
    id: "c-5",
    className: "Boxing Basics",
    trainer: "Chris Morgan",
    status: "published",
    category: "Boxing",
  },
];

async function fetchClasses() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_CLASSES;
}

async function updateClassStatus(id, status) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id, status };
}

async function deleteClass(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id };
}

export default function AdminManageClassesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchClasses()
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

  const openConfirm = (action, row) => {
    setConfirmAction(action);
    setConfirmTarget(row);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return;

    if (confirmAction === "delete") {
      await deleteClass(confirmTarget.id);
      setClasses((prev) => prev.filter((c) => c.id !== confirmTarget.id));
      toast.success(`"${confirmTarget.className}" deleted successfully.`);
      return;
    }

    const newStatus = confirmAction === "approve" ? "published" : "rejected";
    await updateClassStatus(confirmTarget.id, newStatus);
    setClasses((prev) =>
      prev.map((c) =>
        c.id === confirmTarget.id ? { ...c, status: newStatus } : c
      )
    );

    toast.success(
      confirmAction === "approve"
        ? `"${confirmTarget.className}" approved and published.`
        : `"${confirmTarget.className}" rejected.`
    );
  };

  const getConfirmConfig = () => {
    if (!confirmTarget || !confirmAction) {
      return { title: "", message: "", variant: "default", label: "Confirm" };
    }

    if (confirmAction === "approve") {
      return {
        title: "Approve this class?",
        message: `Publish "${confirmTarget.className}" by ${confirmTarget.trainer} to the platform?`,
        variant: "success",
        label: "Approve",
      };
    }

    if (confirmAction === "reject") {
      return {
        title: "Reject this class?",
        message: `Reject "${confirmTarget.className}" by ${confirmTarget.trainer}? It will not be visible to users.`,
        variant: "reject",
        label: "Reject",
      };
    }

    return {
      title: "Delete this class?",
      message: `Permanently delete "${confirmTarget.className}"? This action cannot be undone.`,
      variant: "danger",
      label: "Delete",
    };
  };

  const confirmConfig = getConfirmConfig();

  const columns = useMemo(
    () => [
      {
        key: "className",
        label: "Class Name",
        render: (row) => (
          <div>
            <span className="font-semibold text-white block">{row.className}</span>
            <span className="font-hanken text-xs text-on-surface-variant">{row.category}</span>
          </div>
        ),
      },
      { key: "trainer", label: "Trainer" },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <Badge
            status={
              row.status === "published"
                ? "approved"
                : row.status === "pending"
                  ? "pending"
                  : "rejected"
            }
            dot
          />
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            {row.status === "pending" && (
              <>
                <button
                  type="button"
                  className={cn(dashboardClasses.btnPrimary, "px-3 py-2 text-xs")}
                  onClick={() => openConfirm("approve", row)}
                >
                  <Icon icon={CircleCheck} size={14} />
                  Approve
                </button>
                <button
                  type="button"
                  className={cn(dashboardClasses.btnDanger, "px-3 py-2 text-xs")}
                  onClick={() => openConfirm("reject", row)}
                >
                  <Icon icon={CircleXmark} size={14} />
                  Reject
                </button>
              </>
            )}

            <button
              type="button"
              className={cn(dashboardClasses.btnGhost, "px-3 py-2 text-xs text-error hover:bg-error/10")}
              onClick={() => openConfirm("delete", row)}
            >
              <Icon icon={TrashBin} size={14} />
              Delete
            </button>
          </div>
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
          <h2 className={dashboardClasses.pageTitle}>Manage Classes</h2>
          <p className={dashboardClasses.pageSubtitle}>
            Approve, reject, or remove classes submitted by trainers.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={classes}
          emptyPreset="classes"
          emptyTitle="No classes to manage"
          emptyDescription="No trainer classes have been submitted yet."
          rowKey="id"
        />
      </motion.div>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmAction(null);
          setConfirmTarget(null);
        }}
        onConfirm={handleConfirm}
        variant={confirmConfig.variant}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.label}
      />
    </>
  );
}
