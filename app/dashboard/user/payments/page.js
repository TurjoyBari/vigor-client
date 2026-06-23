"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DataTable from "@/components/dashboard/ui/DataTable";
import Modal from "@/components/dashboard/ui/Modal";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import { cn, dashboardClasses, DASHBOARD_ANIMATION } from "@/lib/dashboard/theme";

function formatCurrency(amount, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(Number(amount) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentStatusBadge({ status }) {
  if (status === "paid") {
    return <Badge variant="success">Paid</Badge>;
  }

  return <Badge status={status || "pending"} />;
}

function PaymentCard({ payment, onViewDetails }) {
  return (
    <motion.article
      className={cn(dashboardClasses.glassCard, "p-5 md:p-6 space-y-4")}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
            Transaction ID
          </p>
          <code className="mt-1 block text-xs text-primary font-mono break-all">
            {payment.transactionId || "—"}
          </code>
        </div>
        <PaymentStatusBadge status={payment.paymentStatus} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
            Amount
          </p>
          <p className="mt-1 font-anybody text-lg font-bold text-secondary">
            {formatCurrency(payment.amount, payment.currency)}
          </p>
        </div>
        <div>
          <p className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
            Currency
          </p>
          <p className="mt-1 font-hanken text-sm text-white uppercase">
            {payment.currency || "usd"}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
            Stripe Session ID
          </p>
          <code className="mt-1 block text-xs text-white font-mono break-all">
            {payment.stripeSessionId || "—"}
          </code>
        </div>
        <div className="sm:col-span-2">
          <p className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
            Payment Date
          </p>
          <p className="mt-1 font-hanken text-sm text-on-surface-variant">
            {formatDate(payment.createdAt)}
          </p>
        </div>
      </div>

      <button
        type="button"
        className={cn(dashboardClasses.btnSecondary, "w-full")}
        onClick={() => onViewDetails(payment)}
      >
        View Details
      </button>
    </motion.article>
  );
}

export default function UserPaymentsPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchPayments = useCallback(async () => {
    if (!session?.user) {
      if (!isPending) {
        setPayments([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      if (!vigorUser?.id) {
        throw new Error("VIGOR user id missing after auth sync");
      }

      console.log("Current User:", vigorUser);

      const response = await publicApi.payments.getUserPayments(vigorUser.id);
      const data = unwrap(response);
      const paymentsFromDb = data?.payments || [];

      console.log("Payments API Response:", paymentsFromDb);

      setPayments(paymentsFromDb);
    } catch (error) {
      console.error("Failed to load payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, isPending]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const columns = useMemo(
    () => [
      {
        key: "transactionId",
        label: "Transaction ID",
        render: (row) => (
          <code className="text-xs text-primary font-mono break-all">
            {row.transactionId || "—"}
          </code>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        render: (row) => (
          <span className="font-semibold text-secondary">
            {formatCurrency(row.amount, row.currency)}
          </span>
        ),
      },
      {
        key: "currency",
        label: "Currency",
        render: (row) => (
          <span className="uppercase text-on-surface-variant">
            {row.currency || "usd"}
          </span>
        ),
      },
      {
        key: "paymentStatus",
        label: "Status",
        render: (row) => <PaymentStatusBadge status={row.paymentStatus} />,
      },
      {
        key: "createdAt",
        label: "Date",
        render: (row) => (
          <span className="text-on-surface-variant">{formatDate(row.createdAt)}</span>
        ),
      },
      {
        key: "stripeSessionId",
        label: "Stripe Session ID",
        render: (row) => (
          <code className="text-xs text-white font-mono break-all">
            {row.stripeSessionId || "—"}
          </code>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <button
            type="button"
            className={dashboardClasses.btnSecondary}
            onClick={() => {
              setSelectedPayment(row);
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
          <h2 className={dashboardClasses.pageTitle}>Payment History</h2>
          <p className={dashboardClasses.pageSubtitle}>
            Your payment records loaded from the MongoDB payments collection.
          </p>
        </header>

        {payments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onViewDetails={(item) => {
                  setSelectedPayment(item);
                  setDetailsOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={payments}
            emptyPreset="default"
            emptyTitle="No payments yet"
            emptyDescription="Complete a class checkout to see your payment history here."
            emptyActionHref="/all-classes"
            emptyActionLabel="Browse Classes"
            rowKey="id"
          />
        )}
      </motion.div>

      <Modal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayment(null);
        }}
        title="Payment Details"
        description="Stripe payment record from MongoDB payments collection"
        size="md"
        footer={
          <button
            type="button"
            onClick={() => setDetailsOpen(false)}
            className={dashboardClasses.btnSecondary}
          >
            Close
          </button>
        }
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <PaymentStatusBadge status={selectedPayment.paymentStatus} />
              <Badge variant="primary">
                {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </Badge>
              <Badge variant="secondary">
                {(selectedPayment.currency || "usd").toUpperCase()}
              </Badge>
            </div>

            <dl className="grid grid-cols-1 gap-4">
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Transaction ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-white break-all">
                  {selectedPayment.transactionId || "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Stripe Session ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-white break-all">
                  {selectedPayment.stripeSessionId || "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Payment Intent ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-white break-all">
                  {selectedPayment.stripePaymentIntentId || "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Class ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-white break-all">
                  {selectedPayment.classId || "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container-low/60 border border-primary-container/15 p-4">
                <dt className="font-geist-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Payment Date
                </dt>
                <dd className="mt-1 font-hanken text-sm text-white">
                  {formatDate(selectedPayment.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}
