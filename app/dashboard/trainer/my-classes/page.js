"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Pencil, TrashBin, Persons } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import DataTable from "@/components/dashboard/ui/DataTable";
import Modal from "@/components/dashboard/ui/Modal";
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
    id: "cls-1",
    className: "HIIT Power Hour",
    category: "HIIT",
    status: "published",
    studentCount: 32,
    students: [
      { id: "s1", name: "Alex Johnson", email: "alex@example.com", enrolledAt: "2026-06-01" },
      { id: "s2", name: "Jamie Lee", email: "jamie@example.com", enrolledAt: "2026-06-03" },
      { id: "s3", name: "Chris Morgan", email: "chris@example.com", enrolledAt: "2026-06-05" },
    ],
  },
  {
    id: "cls-2",
    className: "Morning Yoga Flow",
    category: "Yoga",
    status: "published",
    studentCount: 24,
    students: [
      { id: "s4", name: "Sarah Chen", email: "sarah@example.com", enrolledAt: "2026-06-02" },
      { id: "s5", name: "Taylor Brooks", email: "taylor@example.com", enrolledAt: "2026-06-04" },
    ],
  },
  {
    id: "cls-3",
    className: "Strength Foundations",
    category: "Strength",
    status: "draft",
    studentCount: 8,
    students: [
      { id: "s6", name: "Jordan Smith", email: "jordan@example.com", enrolledAt: "2026-06-10" },
    ],
  },
  {
    id: "cls-4",
    className: "Spin & Burn",
    category: "Cycling",
    status: "pending",
    studentCount: 0,
    students: [],
  },
];

async function fetchTrainerClasses() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_CLASSES;
}

async function deleteClass(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id };
}

export default function TrainerMyClassesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchTrainerClasses()
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

  const handleViewStudents = (row) => {
    setSelectedClass(row);
    setStudentsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    await deleteClass(deleteTarget.id);
    setClasses((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.className}" deleted successfully.`);
  };

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
        key: "category",
        label: "Category",
        render: (row) => <Badge variant="primary">{row.category}</Badge>,
      },
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
                  : "draft"
            }
          />
        ),
      },
      {
        key: "studentCount",
        label: "Student Count",
        render: (row) => (
          <span className="font-geist-label font-bold text-white">
            {row.studentCount}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={cn(dashboardClasses.btnGhost, "px-3 py-2 text-xs")}
              onClick={() => handleViewStudents(row)}
            >
              <Icon icon={Persons} size={14} />
              View Students
            </button>
            <Link
              href={`/dashboard/trainer/add-class?edit=${row.id}`}
              className={cn(dashboardClasses.btnSecondary, "px-3 py-2 text-xs")}
            >
              <Icon icon={Pencil} size={14} />
              Update
            </Link>
            <button
              type="button"
              className={cn(dashboardClasses.btnDanger, "px-3 py-2 text-xs")}
              onClick={() => {
                setDeleteTarget(row);
                setDeleteOpen(true);
              }}
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
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className={dashboardClasses.pageTitle}>My Classes</h2>
            <p className={dashboardClasses.pageSubtitle}>
              Manage your class catalog, students, and publishing status.
            </p>
          </div>
          <Link href="/dashboard/trainer/add-class" className={dashboardClasses.btnPrimary}>
            Add New Class
          </Link>
        </header>

        <DataTable
          columns={columns}
          data={classes}
          emptyPreset="classes"
          emptyActionHref="/dashboard/trainer/add-class"
          emptyActionLabel="Create Your First Class"
          rowKey="id"
        />
      </motion.div>

      {/* View Students Modal */}
      <Modal
        isOpen={studentsModalOpen}
        onClose={() => {
          setStudentsModalOpen(false);
          setSelectedClass(null);
        }}
        title="Enrolled Students"
        description={
          selectedClass
            ? `${selectedClass.className} · ${selectedClass.studentCount} students`
            : ""
        }
        size="lg"
        footer={
          <button
            type="button"
            onClick={() => {
              setStudentsModalOpen(false);
              setSelectedClass(null);
            }}
            className={dashboardClasses.btnSecondary}
          >
            Close
          </button>
        }
      >
        {selectedClass?.students?.length ? (
          <div className="space-y-3">
            {selectedClass.students.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4"
              >
                <div>
                  <p className="font-geist-label text-sm font-bold text-white">
                    {student.name}
                  </p>
                  <p className="font-hanken text-xs text-on-surface-variant mt-0.5">
                    {student.email}
                  </p>
                </div>
                <span className="font-hanken text-xs text-on-surface-variant">
                  Enrolled {student.enrolledAt}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-primary-container/25 bg-primary-container/5 p-8 text-center">
            <p className="font-hanken text-sm text-on-surface-variant">
              No students enrolled in this class yet.
            </p>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete this class?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.className}"? This action cannot be undone.`
            : "Are you sure you want to delete this class?"
        }
        confirmLabel="Delete"
      />
    </>
  );
}
