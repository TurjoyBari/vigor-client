"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CreditCard,
  CircleCheck,
  Shield,
  Persons,
} from "@gravity-ui/icons";
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

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.classId;
  const { data: session, isPending } = useSession();

  const [classItem, setClassItem] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  const loadCheckoutData = useCallback(async () => {
    if (!classId || !session?.user) return;

    setLoading(true);
    try {
      await syncBackendToken(session.user);

      const bookingCheck = await publicApi.bookings.check(classId);
      if (unwrap(bookingCheck)?.booked) {
        toast.info("You have already booked this class.");
        router.replace(`/classes/${classId}`);
        return;
      }

      const [classRes, paymentRes] = await Promise.all([
        publicApi.classes.getById(classId),
        publicApi.payments.createIntent(classId),
      ]);

      setClassItem(unwrap(classRes)?.class || null);
      setPaymentIntent(unwrap(paymentRes)?.payment || null);
    } catch {
      toast.error("Failed to load checkout. Please try again.");
      setClassItem(null);
    } finally {
      setLoading(false);
    }
  }, [classId, session?.user, router]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/login?redirect=/payment/${classId}`);
      return;
    }
    loadCheckoutData();
  }, [isPending, session?.user, loadCheckoutData, router, classId]);

  const handleMockPayment = async () => {
    if (!classId || !session?.user) return;

    setProcessing(true);
    try {
      await syncBackendToken(session.user);

      // Placeholder Stripe flow — replace with Stripe.js when keys are added
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await publicApi.bookings.create(classId);
      const data = unwrap(response);
      setBooking(data?.booking || null);
      setSuccess(true);
      toast.success("Payment successful! Class booked.");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        toast.error("You have already booked this class");
        router.replace(`/classes/${classId}`);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const dashboardHref = `/dashboard/${session?.user?.role || "user"}`;

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="h-96 rounded-[20px] bg-surface-container/40 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!classItem) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 text-center">
        <p className="text-white font-anybody text-xl">Checkout unavailable</p>
        <Link href="/all-classes" className={cn(dashboardClasses.btnPrimary, "inline-flex mt-6")}>
          Browse Classes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
        {!success && (
          <Link
            href={`/classes/${classId}`}
            className="inline-flex items-center gap-2 font-geist-label text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <Icon icon={ArrowLeft} size={16} />
            Back to class
          </Link>
        )}

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
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
                  <span className="text-white font-medium">{booking?.className || classItem.className}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Amount</span>
                  <span className="text-secondary font-bold">
                    {formatPrice(booking?.amount ?? classItem.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Transaction ID</span>
                  <code className="text-xs text-primary font-mono">
                    {booking?.transactionId || paymentIntent?.paymentIntentId || "—"}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="text-[#22C55E] font-semibold">Completed</span>
                </div>
              </div>

              <Link
                href={dashboardHref}
                className={cn(dashboardClasses.btnPrimary, "inline-flex w-full mt-8 justify-center")}
              >
                Go to Dashboard
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={DASHBOARD_ANIMATION.fadeIn.initial}
              animate={DASHBOARD_ANIMATION.fadeIn.animate}
              transition={DASHBOARD_ANIMATION.fadeIn.transition}
              className="space-y-6"
            >
              <header>
                <p className="font-geist-label text-label-sm uppercase tracking-[0.2em] text-secondary mb-2">
                  Secure Checkout
                </p>
                <h1 className="font-anybody text-3xl font-black text-white italic">
                  Complete Payment
                </h1>
              </header>

              <div className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}>
                <div className="space-y-4">
                  <h2 className="font-geist-label text-label-bold uppercase tracking-wider text-on-surface-variant">
                    Order Summary
                  </h2>
                  <div className="rounded-xl border border-primary-container/15 bg-primary-container/5 p-4 space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="font-hanken text-sm text-on-surface-variant">Class</span>
                      <span className="font-anybody font-bold text-white text-right">
                        {classItem.className}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-hanken text-sm text-on-surface-variant flex items-center gap-1.5">
                        <Icon icon={Persons} size={14} />
                        Trainer
                      </span>
                      <span className="font-hanken text-sm text-white">{classItem.trainer}</span>
                    </div>
                    <div className="border-t border-primary-container/10 pt-3 flex justify-between items-center">
                      <span className="font-geist-label text-label-bold uppercase tracking-wider text-on-surface-variant">
                        Total
                      </span>
                      <span className="font-anybody text-2xl font-black text-secondary">
                        {formatPrice(classItem.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-secondary/30 bg-secondary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Icon icon={Shield} size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-hanken text-sm text-white font-medium">
                        Stripe Checkout (Placeholder)
                      </p>
                      <p className="mt-1 font-hanken text-xs text-on-surface-variant leading-relaxed">
                        {paymentIntent?.message ||
                          "Stripe keys will be connected later. This button simulates a successful payment and creates your booking."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMockPayment}
                  disabled={processing}
                  className={cn(dashboardClasses.btnPrimary, "w-full py-4")}
                >
                  <Icon icon={CreditCard} size={18} />
                  {processing ? "Processing..." : `Pay ${formatPrice(classItem.price)}`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
