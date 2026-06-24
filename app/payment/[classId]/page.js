"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  CreditCard,
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function isUserBlocked(user) {
  return user?.status === "blocked" || user?.isBlocked === true;
}

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
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);

  const loadCheckoutData = useCallback(async () => {
    if (!classId || !session?.user) return;

    setLoading(true);
    try {
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      console.log("User status:", vigorUser?.status);

      if (isUserBlocked(vigorUser)) {
        setUserBlocked(true);
        toast.error("Action restricted by Admin");
        router.replace(`/classes/${classId}`);
        return;
      }

      const bookingCheck = await publicApi.bookings.check(classId);
      if (unwrap(bookingCheck)?.booked) {
        toast.info("You have already booked this class.");
        router.replace(`/classes/${classId}`);
        return;
      }

      const classRes = await publicApi.classes.getById(classId);
      setClassItem(unwrap(classRes)?.class || null);
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

  const handleStripePayment = async () => {
    if (!classId || !session?.user) return;

    if (userBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }

    setProcessing(true);
    try {
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      if (isUserBlocked(vigorUser)) {
        setUserBlocked(true);
        toast.error("Action restricted by Admin");
        router.replace(`/classes/${classId}`);
        return;
      }

      console.log("Creating Stripe session");

      const response = await publicApi.payments.createCheckoutSession(classId);
      const data = unwrap(response);
      const sessionId = data?.id;

      console.log("Checkout session:", data);

      if (!sessionId) {
        throw new Error("Missing checkout session id");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.log(error.response);

      if (error?.response?.status === 403) {
        toast.error("Action restricted by Admin");
        router.replace(`/classes/${classId}`);
        return;
      }

      toast.error(error?.message || "Failed to start checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

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
        <Link
          href={`/classes/${classId}`}
          className="inline-flex items-center gap-2 font-geist-label text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <Icon icon={ArrowLeft} size={16} />
          Back to class
        </Link>

        <motion.div
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
                    Stripe Secure Checkout
                  </p>
                  <p className="mt-1 font-hanken text-xs text-on-surface-variant leading-relaxed">
                    You will be redirected to Stripe to enter your card details. Your booking
                    is confirmed only after payment succeeds.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStripePayment}
              disabled={processing || userBlocked}
              className={cn(
                dashboardClasses.btnPrimary,
                "w-full py-4",
                userBlocked && "opacity-60 cursor-not-allowed"
              )}
            >
              <Icon icon={CreditCard} size={18} />
              {processing ? "Redirecting to Stripe..." : `Pay ${formatPrice(classItem.price)}`}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
