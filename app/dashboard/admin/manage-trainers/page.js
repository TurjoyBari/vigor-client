"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowDown } from "@gravity-ui/icons";
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

const INITIAL_TRAINERS = [
  {
    id: "t-1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    specialty: "Yoga",
    classCount: 6,
  },
  {
    id: "t-2",
    name: "Marcus Reed",
    email: "marcus@example.com",
    specialty: "HIIT, Strength Training",
    classCount: 8,
  },
  {
    id: "t-3",
    name: "Emily Torres",
    email: "emily@example.com",
    specialty: "Cycling",
    classCount: 4,
  },
  {
    id: "t-4",
    name: "Alex Johnson",
    email: "alex.trainer@example.com",
    specialty: "CrossFit",
    classCount: 5,
  },
];

async function fetchTrainers() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_TRAINERS;
}

async function demoteTrainer(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id, role: "user" };
}

export default function AdminManageTrainersPage() {
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [demoteTarget, setDemoteTarget] = useState(null);
  const [demoteOpen, setDemoteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchTrainers()
      .then((data) => {
        if (mounted) setTrainers(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleDemoteConfirm = async () => {
    if (!demoteTarget) return;

    await demoteTrainer(demoteTarget.id);
    setTrainers((prev) => prev.filter((t) => t.id !== demoteTarget.id));
    toast.success(`${demoteTarget.name} has been demoted to user.`);
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Trainer Name",
        render: (row) => (
          <span className="font-semibold text-white">{row.name}</span>
        ),
      },
      { key: "email", label: "Email" },
      {
        key: "specialty",
        label: "Specialty",
        render: (row) => <Badge variant="secondary">{row.specialty}</Badge>,
      },
      {
        key: "classCount",
        label: "Classes",
        render: (row) => (
          <span className="font-geist-label text-sm font-bold text-white">
            {row.classCount}
          </span>
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
            View active trainers and demote accounts back to standard user role.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={trainers}
          emptyPreset="default"
          emptyTitle="No trainers found"
          emptyDescription="There are no active trainers on the platform."
          rowKey="id"
        />
      </motion.div>

      <ConfirmationDialog
        isOpen={demoteOpen}
        onClose={() => {
          setDemoteOpen(false);
          setDemoteTarget(null);
        }}
        onConfirm={handleDemoteConfirm}
        variant="warning"
        title="Demote to user?"
        message={
          demoteTarget
            ? `Demote ${demoteTarget.name} (${demoteTarget.email}) from trainer to user? They will lose trainer dashboard access and class management privileges.`
            : "Are you sure you want to demote this trainer?"
        }
        confirmLabel="Demote to User"
      />
    </>
  );
}
