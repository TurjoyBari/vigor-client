"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Persons,
  LayoutList,
  Star,
  StarFill,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import publicApi, { ensureBackendAuth, syncBackendToken, unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function isUserBlocked(user) {
  return user?.status === "blocked" || user?.isBlocked === true;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price) || 0);
}

function ClassHeroImage({ src, alt }) {
  if (src && src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
      />
    );
  }

  if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={PLACEHOLDER_IMAGE}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 60vw"
      priority
    />
  );
}

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.id;
  const { data: session } = useSession();

  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);

  const loadClass = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const response = await publicApi.classes.getById(classId);
      const data = unwrap(response);
      setClassItem(data?.class || null);
    } catch {
      setClassItem(null);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const loadUserStatus = useCallback(async () => {
    if (!session?.user || !classId) {
      setUserBlocked(false);
      setAuthReady(true);
      return;
    }

    try {
      await ensureBackendAuth(session.user);
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      // console.log("User status:", vigorUser?.status);

      setUserBlocked(isUserBlocked(vigorUser));

      const [bookingRes, favoriteRes] = await Promise.all([
        publicApi.bookings.check(classId),
        publicApi.favorites.check(classId),
      ]);
      const bookingData = unwrap(bookingRes);
      const favoriteData = unwrap(favoriteRes);
      setBooked(Boolean(bookingData?.booked));
      setIsFavorite(Boolean(favoriteData?.isFavorite));
      setFavoriteId(favoriteData?.favoriteId || null);
    } catch {
      // User may not have backend token yet — actions will retry sync
    } finally {
      setAuthReady(true);
    }
  }, [session?.user, classId]);

  useEffect(() => {
    loadClass();
  }, [loadClass]);

  useEffect(() => {
    setAuthReady(false);
    loadUserStatus();
  }, [loadUserStatus]);

  const requireAuth = () => {
    if (session?.user) return true;
    toast.info("Please log in to continue.");
    router.push(`/login?redirect=/classes/${classId}`);
    return false;
  };

  const handleBookNow = async () => {
    if (!requireAuth()) return;

    if (userBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }

    if (booked) {
      toast.error("You have already booked this class");
      return;
    }

    setActionLoading(true);
    try {
      await ensureBackendAuth(session.user);
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      if (isUserBlocked(vigorUser)) {
        setUserBlocked(true);
        toast.error("Action restricted by Admin");
        return;
      }

      const checkRes = await publicApi.bookings.check(classId);
      const checkData = unwrap(checkRes);

      if (checkData?.booked) {
        setBooked(true);
        toast.error("You have already booked this class");
        return;
      }

      router.push(`/payment/${classId}`);
    } catch {
      toast.error("Unable to verify booking status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!requireAuth()) return;
    if (!classItem || !classId) return;

    setActionLoading(true);
    try {
      await ensureBackendAuth(session.user);
      const vigorUser = (await syncBackendToken(session.user))?.user || session.user;

      console.log("Current User:", vigorUser);
      console.log("Current Class:", classItem);

      if (isFavorite) {
        await publicApi.favorites.removeByClassId(classId);
        setIsFavorite(false);
        setFavoriteId(null);
        console.log("Favorite Removed");
        toast.success("Removed from favorites");
        return;
      }

      const response = await publicApi.favorites.add(classId);
      const data = unwrap(response);
      const favorite = data?.favorite;

      console.log("Favorite Added:", favorite);

      setIsFavorite(true);
      setFavoriteId(favorite?.favoriteId || favorite?.id || null);
      toast.success("Saved to favorites");
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not update favorites. Please try again.";

      if (status === 409) {
        setIsFavorite(true);
        const checkRes = await publicApi.favorites.check(classId);
        const checkData = unwrap(checkRes);
        setFavoriteId(checkData?.favoriteId || null);
        toast.info("Already in your favorites");
        return;
      }

      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="h-[420px] rounded-[20px] bg-surface-container/40 animate-pulse mb-8" />
          <div className="h-40 rounded-[20px] bg-surface-container/40 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!classItem) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center py-20">
          <h1 className="font-anybody text-3xl font-bold text-white">Class not found</h1>
          <Link href="/all-classes" className={cn(dashboardClasses.btnPrimary, "inline-flex mt-6")}>
            Browse All Classes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <Link
          href="/all-classes"
          className="inline-flex items-center gap-2 font-geist-label text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <Icon icon={ArrowLeft} size={16} />
          Back to All Classes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <motion.div
            className="lg:col-span-7"
            initial={DASHBOARD_ANIMATION.fadeIn.initial}
            animate={DASHBOARD_ANIMATION.fadeIn.animate}
            transition={DASHBOARD_ANIMATION.fadeIn.transition}
          >
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-[20px] overflow-hidden border border-primary-container/20 bg-surface-container">
              <ClassHeroImage src={classItem.image} alt={classItem.className} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 rounded-full bg-primary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-primary-container">
                {classItem.category}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={DASHBOARD_ANIMATION.fadeIn.initial}
            animate={DASHBOARD_ANIMATION.fadeIn.animate}
            transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: 0.08 }}
          >
            <div className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}>
              <div>
                <p className="font-geist-label text-label-sm uppercase tracking-[0.2em] text-secondary mb-2">
                  {classItem.difficulty}
                </p>
                <h1 className="font-anybody text-3xl md:text-4xl font-black text-white italic leading-tight">
                  {classItem.className}
                </h1>
                <p className="mt-3 flex items-center gap-2 font-hanken text-on-surface-variant">
                  <Icon icon={Persons} size={16} className="text-secondary" />
                  <span>
                    Trainer:{" "}
                    <span className="text-white font-medium">{classItem.trainer}</span>
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Calendar, label: "Schedule", value: classItem.schedule },
                  { icon: Clock, label: "Duration", value: classItem.duration },
                  { icon: LayoutList, label: "Bookings", value: `${classItem.bookingCount ?? 0}` },
                  {
                    icon: LayoutList,
                    label: "Price",
                    value: formatPrice(classItem.price),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-primary-container/15 bg-primary-container/5 p-3"
                  >
                    <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant">
                      <Icon icon={item.icon} size={12} />
                      {item.label}
                    </p>
                    <p className="mt-1 font-hanken text-sm text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-geist-label text-label-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  About this class
                </h2>
                <p className="font-hanken text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {classItem.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBookNow}
                  disabled={actionLoading || !authReady || booked || userBlocked}
                  className={cn(
                    dashboardClasses.btnPrimary,
                    "flex-1",
                    (booked || userBlocked) && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {booked
                    ? "Already Booked"
                    : userBlocked
                      ? "Booking Restricted"
                      : "Book Now"}
                </button>

                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  disabled={actionLoading || !authReady}
                  className={cn(
                    dashboardClasses.btnSecondary,
                    "flex-1",
                    isFavorite && "border-secondary/40 text-secondary"
                  )}
                >
                  <Icon icon={isFavorite ? StarFill : Star} size={16} />
                  {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
