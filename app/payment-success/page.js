"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CircleCheck } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price) || 0);
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
          <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="h-96 rounded-[20px] bg-surface-container/40 animate-pulse" />
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session, isPending } = useSession();

  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!sessionId || !session?.user) return;

    setLoading(true);
    try {
      await syncBackendToken(session.user);
      const response = await publicApi.payments.getCheckoutSession(sessionId);
      const data = unwrap(response);
      setCheckoutData(data);
    } catch {
      toast.error("Unable to load payment confirmation.");
      setCheckoutData(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId, session?.user]);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/login?redirect=/payment-success?session_id=${sessionId || ""}`);
      return;
    }

    if (!sessionId) {
      setLoading(false);
      return;
    }

    loadSession();
  }, [isPending, session?.user, sessionId, loadSession, router]);

  const dashboardHref = `/dashboard/${session?.user?.role || "user"}`;
  const classItem = checkoutData?.class;
  const payment = checkoutData?.payment;
  const stripeSession = checkoutData?.session;

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="h-96 rounded-[20px] bg-surface-container/40 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!sessionId || !checkoutData) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 text-center">
        <p className="text-white font-anybody text-xl">Payment confirmation unavailable</p>
        <Link href="/all-classes" className={cn(dashboardClasses.btnPrimary, "inline-flex mt-6")}>
          Browse Classes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={cn(dashboardClasses.glassCard, "p-8 md:p-10 text-center")}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30"
          >
            <Icon icon={CircleCheck} size={40} className="text-[#22C55E]" />
          </motion.div>

          <h1 className="font-anybody text-3xl font-black text-white italic">
            Payment Successful!
          </h1>
          <p className="mt-3 font-hanken text-on-surface-variant">
            Your class has been booked. See you at training!
          </p>

          <div className="mt-8 rounded-2xl border border-primary-container/20 bg-primary-container/5 p-5 text-left space-y-3">
            <h2 className="font-geist-label text-label-bold uppercase tracking-wider text-on-surface-variant">
              Transaction Summary
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Class</span>
              <span className="text-white font-medium">
                {classItem?.className || "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Amount</span>
              <span className="text-secondary font-bold">
                {formatPrice(payment?.amount ?? stripeSession?.amountTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm gap-4">
              <span className="text-on-surface-variant shrink-0">Session ID</span>
              <code className="text-xs text-primary font-mono text-right break-all">
                {payment?.stripeSessionId || stripeSession?.id || sessionId}
              </code>
            </div>
            <div className="flex justify-between text-sm gap-4">
              <span className="text-on-surface-variant shrink-0">Payment Intent</span>
              <code className="text-xs text-primary font-mono text-right break-all">
                {payment?.stripePaymentIntentId || "—"}
              </code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Status</span>
              <span className="text-[#22C55E] font-semibold capitalize">
                {payment?.paymentStatus || stripeSession?.paymentStatus || "paid"}
              </span>
            </div>
          </div>

          <Link
            href={dashboardHref}
            className={cn(dashboardClasses.btnPrimary, "inline-flex w-full mt-8 justify-center")}
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
