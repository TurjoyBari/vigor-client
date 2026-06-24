"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Ban, CircleCheck, Shield } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { useVigorRole } from "@/lib/hooks/useVigorRole";
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

function mapUser(user) {
  const status =
    user.status === "blocked" || user.isBlocked ? "blocked" : "active";

  return {
    id: user.id,
    name: user.name || "Unknown",
    email: user.email || "",
    image: user.image || null,
    role: user.role || "user",
    status,
  };
}

function UserAvatar({ src, name }) {
  const isLocal = src?.startsWith("/");
  const label = name || "User";

  if (isLocal && src) {
    return (
      <Image
        src={src}
        alt={label}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover border border-primary-container/20"
      />
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={label}
        className="h-12 w-12 rounded-full object-cover border border-primary-container/20"
      />
    );
  }

  return (
    <div className="h-12 w-12 rounded-full bg-primary-container/20 border border-primary-container/20 flex items-center justify-center text-sm font-semibold text-on-surface-variant">
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

function canBlockUser(row, currentAdminId) {
  if (row.role === "admin") return false;
  if (currentAdminId && String(row.id) === String(currentAdminId)) return false;
  return true;
}

export default function AdminManageUsersPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const { vigorUser } = useVigorRole();
  const currentAdminId = vigorUser?.id || null;

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!session?.user) {
      if (!sessionPending) {
        setUsers([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await syncBackendToken(session.user);

      const response = await adminApi.getUsers();
      const data = unwrap(response);
      const usersFromDb = (data?.users || []).map(mapUser);

      console.log("Admin users from DB:", usersFromDb);

      setUsers(usersFromDb);
    } catch (error) {
      console.error("Failed to load users:", error);
      console.log(error.response);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openConfirm = (action, user) => {
    setConfirmAction(action);
    setConfirmTarget(user);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
    setConfirmTarget(null);
    setSubmitting(false);
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return;

    setSubmitting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      if (confirmAction === "block") {
        const response = await adminApi.blockUser(confirmTarget.id);
        const data = unwrap(response);
        const updated = mapUser(data?.user || {});

        console.log("User blocked:", updated);

        setUsers((prev) =>
          prev.map((u) => (u.id === confirmTarget.id ? { ...u, ...updated } : u))
        );
        toast.success("User blocked successfully");
      }

      if (confirmAction === "unblock") {
        const response = await adminApi.unblockUser(confirmTarget.id);
        const data = unwrap(response);
        const updated = mapUser(data?.user || {});

        console.log("User unblocked:", updated);

        setUsers((prev) =>
          prev.map((u) => (u.id === confirmTarget.id ? { ...u, ...updated } : u))
        );
        toast.success("User unblocked successfully");
      }

      if (confirmAction === "makeAdmin") {
        const response = await adminApi.promoteUser(confirmTarget.id);
        const data = unwrap(response);
        const updated = mapUser(data?.user || {});

        console.log("User promoted to admin:", updated);

        setUsers((prev) =>
          prev.map((u) => (u.id === confirmTarget.id ? { ...u, ...updated } : u))
        );
        toast.success(`${confirmTarget.name} is now an admin.`);
      }

      closeConfirm();
    } catch (error) {
      console.error("User action failed:", error);
      console.log(error.response);
    } finally {
      setSubmitting(false);
    }
  };

  const getConfirmConfig = () => {
    if (!confirmTarget || !confirmAction) {
      return { title: "", message: "", variant: "default", label: "Confirm" };
    }

    if (confirmAction === "block") {
      return {
        title: "Block this user?",
        message: `Block ${confirmTarget.name} (${confirmTarget.email})? They will be restricted from booking, commenting, and other actions.`,
        variant: "danger",
        label: submitting ? "Blocking..." : "Block User",
      };
    }

    if (confirmAction === "unblock") {
      return {
        title: "Unblock this user?",
        message: `Restore full access for ${confirmTarget.name}?`,
        variant: "success",
        label: submitting ? "Unblocking..." : "Unblock User",
      };
    }

    return {
      title: "Make admin?",
      message: `Grant admin privileges to ${confirmTarget.name}? This gives full platform access.`,
      variant: "warning",
      label: submitting ? "Promoting..." : "Make Admin",
    };
  };

  const confirmConfig = getConfirmConfig();

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Profile",
        render: (row) => <UserAvatar src={row.image} name={row.name} />,
      },
      {
        key: "name",
        label: "Name",
        render: (row) => (
          <span className="font-semibold text-white">{row.name}</span>
        ),
      },
      { key: "email", label: "Email" },
      {
        key: "role",
        label: "Role",
        render: (row) => <Badge role={row.role} size="sm" />,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <Badge status={row.status === "blocked" ? "blocked" : "active"} />
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            {row.status === "blocked" ? (
              <button
                type="button"
                className={cn(dashboardClasses.btnSecondary, "px-3 py-2 text-xs")}
                onClick={() => openConfirm("unblock", row)}
              >
                <Icon icon={CircleCheck} size={14} />
                Unblock
              </button>
            ) : (
              canBlockUser(row, currentAdminId) && (
                <button
                  type="button"
                  className={cn(dashboardClasses.btnDanger, "px-3 py-2 text-xs")}
                  onClick={() => openConfirm("block", row)}
                >
                  <Icon icon={Ban} size={14} />
                  Block
                </button>
              )
            )}

            {row.role !== "admin" && (
              <button
                type="button"
                className={cn(dashboardClasses.btnPrimary, "px-3 py-2 text-xs")}
                onClick={() => openConfirm("makeAdmin", row)}
              >
                <Icon icon={Shield} size={14} />
                Make Admin
              </button>
            )}
          </div>
        ),
      },
    ],
    [currentAdminId]
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
          <h2 className={dashboardClasses.pageTitle}>Manage Users</h2>
          <p className={dashboardClasses.pageSubtitle}>
            View, block, unblock, and manage user roles across the platform.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={users}
          emptyPreset="default"
          emptyTitle="No users found"
          emptyDescription="There are no users to display."
          rowKey="id"
        />
      </motion.div>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        variant={confirmConfig.variant}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.label}
      />
    </>
  );
}
