"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Star, TrashBin } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const PLACEHOLDER_IMAGE = "/images/hero-strongest.png";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price) || 0);
}

function FavoriteCardImage({ src, alt }) {
  if (src && src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    );
  }

  if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <Image
      src={PLACEHOLDER_IMAGE}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
}

function FavoriteCard({ item, index, onRemove }) {
  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "overflow-hidden group"
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <FavoriteCardImage src={item.image} alt={item.className} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary-container/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
          <Icon icon={Star} size={12} />
          {item.category}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-secondary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0B1120]">
          {item.difficulty}
        </span>
      </div>

      <div className="p-4 md:p-5 space-y-4">
        <div>
          <h3 className="font-anybody text-lg font-bold text-white">{item.className}</h3>
          <p className="mt-1 font-hanken text-sm text-on-surface-variant">
            Trainer:{" "}
            <span className="text-on-surface">{item.trainerName}</span>
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Schedule
            </dt>
            <dd className="mt-0.5 text-on-surface">{item.schedule || "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Duration
            </dt>
            <dd className="mt-0.5 text-on-surface">{item.duration || "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Price
            </dt>
            <dd className="mt-0.5 font-semibold text-secondary">
              {formatPrice(item.price)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/classes/${item.classId}`}
            className={cn(dashboardClasses.btnSecondary, "flex-1 text-center")}
          >
            View Class
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className={cn(dashboardClasses.btnDanger, "flex-1")}
          >
            <Icon icon={TrashBin} size={16} />
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function UserFavoritesPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!session?.user) {
      if (!isPending) {
        setFavorites([]);
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

      const response = await publicApi.favorites.getUserFavorites(vigorUser.id);
      const data = unwrap(response);
      const favoritesFromDb = data?.favorites || [];

      console.log("Favorites API Response:", favoritesFromDb);

      setFavorites(favoritesFromDb);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, isPending]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveConfirm = async () => {
    if (!removeTarget?.classId) return;

    setRemoving(true);
    try {
      await syncBackendToken(session.user);
      await publicApi.favorites.removeByClassId(removeTarget.classId);
      setFavorites((prev) =>
        prev.filter((item) => item.classId !== removeTarget.classId)
      );
      console.log("Favorite Removed");
      toast.success(`"${removeTarget.className}" removed from favorites.`);
      setRemoveOpen(false);
      setRemoveTarget(null);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Unable to remove favorite. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  if (isPending || loading) {
    return <LoadingSkeleton variant="grid" count={3} />;
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
          <h2 className={dashboardClasses.pageTitle}>Favorites</h2>
          <p className={dashboardClasses.pageSubtitle}>
            Saved classes loaded from your MongoDB favorites collection.
          </p>
        </header>

        {favorites.length === 0 ? (
          <EmptyState
            preset="favorites"
            actionHref="/all-classes"
            actionLabel="Explore Classes"
          />
        ) : (
          <div className={dashboardClasses.gridCards}>
            {favorites.map((item, index) => (
              <FavoriteCard
                key={item.id}
                item={item}
                index={index}
                onRemove={(target) => {
                  setRemoveTarget(target);
                  setRemoveOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      <ConfirmationDialog
        isOpen={removeOpen}
        onClose={() => {
          if (removing) return;
          setRemoveOpen(false);
          setRemoveTarget(null);
        }}
        onConfirm={handleRemoveConfirm}
        variant="danger"
        title="Remove from favorites?"
        message={
          removeTarget
            ? `Are you sure you want to remove "${removeTarget.className}" from your favorites?`
            : "Are you sure you want to remove this class?"
        }
        confirmLabel={removing ? "Removing..." : "Remove"}
      />
    </>
  );
}
