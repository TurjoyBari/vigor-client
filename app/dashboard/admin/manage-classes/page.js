"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CircleCheck, CircleXmark, TrashBin } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
import DataTable from "@/components/dashboard/ui/DataTable";
import Badge from "@/components/dashboard/ui/Badge";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function mapBadgeStatus(status) {
  if (status === "published" || status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  if (status === "pending") return "pending";
  return "draft";
}

function mapClass(item) {
  return {
    id: item.id,
    className: item.className,
    trainer: item.trainer || item.trainerName || "Unknown Trainer",
    category: item.category,
    status: item.status,
    image: item.image,
  };
}

function ClassThumbnail({ src, alt }) {
  const isLocal = src?.startsWith("/");

  if (isLocal && src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="h-12 w-12 rounded-lg object-cover border border-primary-container/20"
      />
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-12 w-12 rounded-lg object-cover border border-primary-container/20"
      />
    );
  }

  return (
    <div className="h-12 w-12 rounded-lg bg-primary-container/20 border border-primary-container/20 flex items-center justify-center text-xs text-on-surface-variant">
      N/A
    </div>
  );
}

export default function AdminManageClassesPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = useCallback(async () => {
    if (!session?.user) {
      if (!sessionPending) {
        setClasses([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await syncBackendToken(session.user);

      const response = await adminApi.getClasses();
      const data = unwrap(response);
      const classData = (data?.classes || []).map(mapClass);

      console.log("Admin classes from DB:", classData);

      setClasses(classData);
    } catch (error) {
      console.error("Failed to load admin classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openConfirm = (action, row) => {
    setConfirmAction(action);
    setConfirmTarget(row);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return;

    setSubmitting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      if (confirmAction === "delete") {
        await adminApi.deleteClass(confirmTarget.id);
        setClasses((prev) => prev.filter((c) => c.id !== confirmTarget.id));
        toast.success(`"${confirmTarget.className}" deleted successfully.`);
      } else if (confirmAction === "approve") {
        const response = await adminApi.approveClass(confirmTarget.id);
        const data = unwrap(response);
        const updated = mapClass(data?.class || {});

        console.log("Class approved:", updated);

        setClasses((prev) =>
          prev.map((c) => (c.id === confirmTarget.id ? { ...c, ...updated } : c))
        );
        toast.success(`"${confirmTarget.className}" approved successfully.`);
      } else if (confirmAction === "reject") {
        const response = await adminApi.rejectClass(confirmTarget.id);
        const data = unwrap(response);
        const updated = mapClass(data?.class || {});

        console.log("Class rejected:", updated);

        setClasses((prev) =>
          prev.map((c) => (c.id === confirmTarget.id ? { ...c, ...updated } : c))
        );
        toast.success(`"${confirmTarget.className}" rejected.`);
      }

      setConfirmOpen(false);
      setConfirmAction(null);
      setConfirmTarget(null);
    } catch (error) {
      console.error("Class action failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getConfirmConfig = () => {
    if (!confirmTarget || !confirmAction) {
      return { title: "", message: "", variant: "default", label: "Confirm" };
    }

    if (confirmAction === "approve") {
      return {
        title: "Approve this class?",
        message: `Publish "${confirmTarget.className}" by ${confirmTarget.trainer} to /all-classes?`,
        variant: "success",
        label: submitting ? "Approving..." : "Approve",
      };
    }

    if (confirmAction === "reject") {
      return {
        title: "Reject this class?",
        message: `Reject "${confirmTarget.className}" by ${confirmTarget.trainer}? It will not be visible to users.`,
        variant: "reject",
        label: submitting ? "Rejecting..." : "Reject",
      };
    }

    return {
      title: "Delete this class?",
      message: `Permanently delete "${confirmTarget.className}"? This action cannot be undone.`,
      variant: "danger",
      label: submitting ? "Deleting..." : "Delete",
    };
  };

  const confirmConfig = getConfirmConfig();

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (row) => (
          <ClassThumbnail src={row.image} alt={row.className} />
        ),
      },
      {
        key: "className",
        label: "Class Name",
        render: (row) => (
          <span className="font-semibold text-white">{row.className}</span>
        ),
      },
      {
        key: "trainer",
        label: "Trainer Name",
        render: (row) => (
          <span className="font-hanken text-sm text-on-surface">{row.trainer}</span>
        ),
      },
      {
        key: "category",
        label: "Category",
        render: (row) => <Badge variant="primary">{row.category}</Badge>,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <Badge status={mapBadgeStatus(row.status)} dot />,
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
              className={cn(
                dashboardClasses.btnGhost,
                "px-3 py-2 text-xs text-error hover:bg-error/10"
              )}
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

  if (sessionPending || loading) {
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
            All trainer classes from MongoDB — approve, reject, or delete.
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
          if (!submitting) {
            setConfirmOpen(false);
            setConfirmAction(null);
            setConfirmTarget(null);
          }
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
