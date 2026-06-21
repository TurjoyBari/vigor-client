"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Ban, CircleCheck, Shield } from "@gravity-ui/icons";
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

const INITIAL_USERS = [
  {
    id: "u-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "user",
    status: "active",
  },
  {
    id: "u-2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "trainer",
    status: "active",
  },
  {
    id: "u-3",
    name: "Marcus Reed",
    email: "marcus@example.com",
    role: "trainer",
    status: "active",
  },
  {
    id: "u-4",
    name: "Jamie Lee",
    email: "jamie@example.com",
    role: "user",
    status: "blocked",
  },
  {
    id: "u-5",
    name: "Admin User",
    email: "admin@vigor.com",
    role: "admin",
    status: "active",
  },
];

async function fetchUsers() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_USERS;
}

async function updateUserStatus(userId, status) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, userId, status };
}

async function promoteToAdmin(userId) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, userId, role: "admin" };
}

export default function AdminManageUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchUsers()
      .then((data) => {
        if (mounted) setUsers(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openConfirm = (action, user) => {
    setConfirmAction(action);
    setConfirmTarget(user);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return;

    if (confirmAction === "block") {
      await updateUserStatus(confirmTarget.id, "blocked");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === confirmTarget.id ? { ...u, status: "blocked" } : u
        )
      );
      toast.success(`${confirmTarget.name} has been blocked.`);
    }

    if (confirmAction === "unblock") {
      await updateUserStatus(confirmTarget.id, "active");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === confirmTarget.id ? { ...u, status: "active" } : u
        )
      );
      toast.success(`${confirmTarget.name} has been unblocked.`);
    }

    if (confirmAction === "makeAdmin") {
      await promoteToAdmin(confirmTarget.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === confirmTarget.id ? { ...u, role: "admin" } : u
        )
      );
      toast.success(`${confirmTarget.name} is now an admin.`);
    }
  };

  const getConfirmConfig = () => {
    if (!confirmTarget || !confirmAction) {
      return { title: "", message: "", variant: "default", label: "Confirm" };
    }

    if (confirmAction === "block") {
      return {
        title: "Block this user?",
        message: `Block ${confirmTarget.name} (${confirmTarget.email})? They will lose access to the platform.`,
        variant: "danger",
        label: "Block User",
      };
    }

    if (confirmAction === "unblock") {
      return {
        title: "Unblock this user?",
        message: `Restore access for ${confirmTarget.name}?`,
        variant: "success",
        label: "Unblock User",
      };
    }

    return {
      title: "Make admin?",
      message: `Grant admin privileges to ${confirmTarget.name}? This gives full platform access.`,
      variant: "warning",
      label: "Make Admin",
    };
  };

  const confirmConfig = getConfirmConfig();

  const columns = useMemo(
    () => [
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
              row.role !== "admin" && (
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
