"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowDown } from "@gravity-ui/icons";
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

function mapTrainer(user) {
  const status =
    user.status === "blocked" || user.isBlocked ? "blocked" : "active";

  return {
    id: user.id,
    name: user.name || "Unknown",
    email: user.email || "",
    image: user.image || null,
    role: user.role || "trainer",
    status,
    trainerApplicationStatus: user.trainerApplicationStatus || null,
  };
}

function TrainerAvatar({ src, name }) {
  const isLocal = src?.startsWith("/");
  const label = name || "Trainer";

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

export default function AdminManageTrainersPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [demoteTarget, setDemoteTarget] = useState(null);
  const [demoteOpen, setDemoteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrainers = useCallback(async () => {
    if (!session?.user) {
      if (!sessionPending) {
        setTrainers([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await syncBackendToken(session.user);

      const response = await adminApi.getTrainers();
      const data = unwrap(response);
      const trainersFromDb = (data?.trainers || []).map(mapTrainer);

      console.log("Trainers from users collection:", trainersFromDb);
      trainersFromDb.forEach((trainer) => {
        console.log("Trainer role:", trainer.role);
      });

      setTrainers(trainersFromDb);
    } catch (error) {
      console.error("Failed to load trainers:", error);
      console.log(error.response);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const closeDemoteDialog = () => {
    setDemoteOpen(false);
    setDemoteTarget(null);
    setSubmitting(false);
  };

  const handleDemoteConfirm = async () => {
    if (!demoteTarget) return;

    setSubmitting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      console.log("Trainer role:", demoteTarget.role);

      const response = await adminApi.demoteTrainer(demoteTarget.id);
      const data = unwrap(response);
      const demoted = mapTrainer(data?.trainer || {});

      console.log("Demotion result:", demoted);

      setTrainers((prev) => prev.filter((t) => t.id !== demoteTarget.id));
      toast.success("Trainer demoted to user successfully");
      closeDemoteDialog();
    } catch (error) {
      console.error("Demote trainer failed:", error);
      console.log(error.response);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Profile",
        render: (row) => <TrainerAvatar src={row.image} name={row.name} />,
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
        label: "Action",
        render: (row) => (
          <button
            type="button"
            className={cn(dashboardClasses.btnDanger, "px-3 py-2 text-xs")}
            onClick={() => {
              setDemoteTarget(row);
              setDemoteOpen(true);
            }}
          >
            <Icon icon={ArrowDown} size={14} />
            Demote to User
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
          <h2 className={dashboardClasses.pageTitle}>Manage Trainers</h2>
          <p className={dashboardClasses.pageSubtitle}>
            Trainers are loaded from the MongoDB users collection (role: trainer).
          </p>
        </header>

        <DataTable
          columns={columns}
          data={trainers}
          emptyPreset="default"
          emptyTitle="No trainers found"
          emptyDescription="There are no users with role trainer on the platform."
          rowKey="id"
        />
      </motion.div>

      <ConfirmationDialog
        isOpen={demoteOpen}
        onClose={closeDemoteDialog}
        onConfirm={handleDemoteConfirm}
        variant="warning"
        title="Demote to user?"
        message="Are you sure you want to remove trainer privileges?"
        confirmLabel={submitting ? "Demoting..." : "Demote to User"}
      />
    </>
  );
}
