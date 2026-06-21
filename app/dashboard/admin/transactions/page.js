"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "@gravity-ui/icons";
import StatsCard from "@/components/dashboard/ui/StatsCard";
import DataTable from "@/components/dashboard/ui/DataTable";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const INITIAL_TRANSACTIONS = [
  {
    id: "txn_001928374",
    userEmail: "alex@example.com",
    amount: 29.99,
    date: "2026-06-18",
    status: "completed",
    type: "Class Booking",
  },
  {
    id: "txn_001928375",
    userEmail: "sarah@example.com",
    amount: 49.99,
    date: "2026-06-17",
    status: "completed",
    type: "Premium Plan",
  },
  {
    id: "txn_001928376",
    userEmail: "jamie@example.com",
    amount: 29.99,
    date: "2026-06-16",
    status: "completed",
    type: "Class Booking",
  },
  {
    id: "txn_001928377",
    userEmail: "chris@example.com",
    amount: 19.99,
    date: "2026-06-15",
    status: "refunded",
    type: "Class Booking",
  },
  {
    id: "txn_001928378",
    userEmail: "taylor@example.com",
    amount: 99.99,
    date: "2026-06-14",
    status: "completed",
    type: "Annual Membership",
  },
  {
    id: "txn_001928379",
    userEmail: "jordan@example.com",
    amount: 29.99,
    date: "2026-06-12",
    status: "pending",
    type: "Class Booking",
  },
];

async function fetchTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_TRANSACTIONS;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function AdminTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetchTransactions()
      .then((data) => {
        if (mounted) setTransactions(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = useMemo(
    () => [
      {
        key: "userEmail",
        label: "User Email",
        render: (row) => (
          <span className="text-on-surface">{row.userEmail}</span>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        render: (row) => (
          <span className="font-geist-label font-bold text-white">
            {formatCurrency(row.amount)}
          </span>
        ),
      },
      {
        key: "date",
        label: "Date",
        render: (row) => (
          <span className="text-on-surface-variant">{row.date}</span>
        ),
      },
      {
        key: "id",
        label: "Transaction ID",
        render: (row) => (
          <code className="rounded-lg bg-surface-container-low px-2 py-1 text-xs text-secondary font-mono">
            {row.id}
          </code>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <Badge
            status={
              row.status === "completed"
                ? "approved"
                : row.status === "pending"
                  ? "pending"
                  : "rejected"
            }
            size="sm"
          />
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <header>
        <h2 className={dashboardClasses.pageTitle}>Transactions</h2>
        <p className={dashboardClasses.pageSubtitle}>
          View all platform payments, bookings, and membership transactions.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={CreditCard}
          accent="success"
          index={0}
        />
        <StatsCard
          title="Total Transactions"
          value={transactions.length}
          icon={CreditCard}
          accent="primary"
          index={1}
        />
        <StatsCard
          title="Completed"
          value={transactions.filter((t) => t.status === "completed").length}
          icon={CreditCard}
          accent="secondary"
          index={2}
        />
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        emptyPreset="default"
        emptyTitle="No transactions"
        emptyDescription="No payment records found."
        rowKey="id"
      />
    </motion.div>
  );
}
