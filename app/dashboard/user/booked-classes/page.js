"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DataTable from "@/components/dashboard/ui/DataTable";
import Modal from "@/components/dashboard/ui/Modal";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import { dashboardClasses, DASHBOARD_ANIMATION } from "@/lib/dashboard/theme";

function BookingStatusBadge({ status }) {
  if (status === "confirmed") {
    return <Badge variant="success">Confirmed</Badge>;
  }

  return <Badge status={status || "pending"} />;
}

export default function UserBookedClassesPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!session?.user) {
      if (!isPending) {
        setBookings([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user || session.user;

      console.log("User:", vigorUser);

      const response = await publicApi.bookings.getMine();
      const data = unwrap(response);
      const bookingsFromDb = data?.classes || data?.bookings || [];

      console.log("Bookings from DB:", bookingsFromDb);

      const confirmedBookings = bookingsFromDb.filter(
        (booking) => booking.status === "confirmed"
      );

      console.log("Filtered bookings:", confirmedBookings);

      setBookings(confirmedBookings);
    } catch (error) {
      console.error("Failed to load booked classes:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, isPending]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
        key: "category",
        label: "Category",
        render: (row) => (
          <span className="text-on-surface-variant">{row.category}</span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <BookingStatusBadge status={row.status} />,
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <button
            type="button"
            className={dashboardClasses.btnSecondary}
            onClick={() => {
              setSelectedBooking(row);
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

  if (isPending || loading) {
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
            Class snapshots from your MongoDB bookings — payment details are kept
            separately.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={bookings}
          emptyPreset="classes"
          emptyActionHref="/all-classes"
          emptyActionLabel="Browse Classes"
          rowKey="id"
        />
      </motion.div>

      <Modal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedBooking(null);
        }}
        title={selectedBooking?.className || "Class Details"}
        description="Booking snapshot stored at enrollment time"
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
            <Link href="/all-classes" className={dashboardClasses.btnPrimary}>
              Browse More Classes
            </Link>
          </>
        }
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{selectedBooking.category}</Badge>
              <Badge variant="secondary">{selectedBooking.difficulty}</Badge>
              <BookingStatusBadge status={selectedBooking.status} />
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Class
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedBooking.className}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Trainer
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedBooking.trainerName}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Schedule
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedBooking.schedule}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Duration
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedBooking.duration}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Location
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {selectedBooking.location}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Status
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white capitalize">
                  {selectedBooking.status}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}
