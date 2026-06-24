"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Pencil, TrashBin, Persons } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { trainerApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
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
    category: item.category,
    status: item.status,
    bookingCount: item.bookingCount ?? item.studentCount ?? 0,
  };
}

function formatEnrolledAt(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TrainerMyClassesPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

      const response = await trainerApi.getClasses();
      const data = unwrap(response);
      const classData = (data?.classes || []).map(mapClass);

      console.log("Trainer classes from DB:", classData);

      setClasses(classData);
    } catch (error) {
      console.error("Failed to load trainer classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleViewStudents = async (row) => {
    setSelectedClass(row);
    setStudentsModalOpen(true);
    setStudents([]);
    setStudentsLoading(true);

    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      const response = await trainerApi.getClassStudents(row.id);
      const data = unwrap(response);
      const studentList = data?.students || [];

      console.log("Class students from DB:", studentList);

      setStudents(
        studentList.map((student) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          enrolledAt: formatEnrolledAt(student.enrolledAt),
        }))
      );
    } catch (error) {
      console.error("Failed to load class students:", error);
      toast.error("Failed to load enrolled students.");
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      await trainerApi.deleteClass(deleteTarget.id);
      setClasses((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.className}" deleted successfully.`);
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete class:", error);
    } finally {
      setDeleting(false);
    }
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
        render: (row) => <Badge status={mapBadgeStatus(row.status)} dot />,
      },
      {
        key: "bookingCount",
        label: "Booking Count",
        render: (row) => (
          <span className="font-geist-label font-bold text-white">
            {row.bookingCount}
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
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className={dashboardClasses.pageTitle}>My Classes</h2>
            <p className={dashboardClasses.pageSubtitle}>
              Classes you created in MongoDB — filtered by your trainer account.
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

      <Modal
        isOpen={studentsModalOpen}
        onClose={() => {
          setStudentsModalOpen(false);
          setSelectedClass(null);
          setStudents([]);
        }}
        title="Enrolled Students"
        description={
          selectedClass
            ? `${selectedClass.className} · ${selectedClass.bookingCount} booking(s)`
            : ""
        }
        size="lg"
        footer={
          <button
            type="button"
            onClick={() => {
              setStudentsModalOpen(false);
              setSelectedClass(null);
              setStudents([]);
            }}
            className={dashboardClasses.btnSecondary}
          >
            Close
          </button>
        }
      >
        {studentsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-xl bg-surface-container-low/60 animate-pulse"
              />
            ))}
          </div>
        ) : students.length ? (
          <div className="space-y-3">
            {students.map((student) => (
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
          if (!deleting) {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete this class?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.className}"? This action cannot be undone.`
            : "Are you sure you want to delete this class?"
        }
        confirmLabel={deleting ? "Deleting..." : "Delete"}
      />
    </>
  );
}
