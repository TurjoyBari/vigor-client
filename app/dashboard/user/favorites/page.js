"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Star, TrashBin } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const INITIAL_FAVORITES = [
  {
    id: "fav-1",
    className: "HIIT Power Hour",
    trainerName: "Marcus Reed",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtCJNd7GGrZLAAM1Rl2NJf6X5sYijONIH94EItgwomRJU0NZhimF3Ghp-uURYwM7c0TMXr5543_WnhEAxKBzZDDwPN9AzkDL4Om-n1mHl5gB4w3diT_1yZiKZuoovGaOQo1pBQg2mnQCe9eJTGAsu9WwliavpvJl6rVISYTQhDrnU5TXTLeLjI4d9R04s0195ky9wMIA-LYNrq63370ug59nC-smrdSYMwvYsKw89BNFb12HXRJdUkC8_0",
    category: "HIIT",
  },
  {
    id: "fav-2",
    className: "Morning Yoga Flow",
    trainerName: "Sarah Chen",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtCJNd7GGrZLAAM1Rl2NJf6X5sYijONIH94EItgwomRJU0NZhimF3Ghp-uURYwM7c0TMXr5543_WnhEAxKBzZDDwPN9AzkDL4Om-n1mHl5gB4w3diT_1yZiKZuoovGaOQo1pBQg2mnQCe9eJTGAsu9WwliavpvJl6rVISYTQhDrnU5TXTLeLjI4d9R04s0195ky9wMIA-LYNrq63370ug59nC-smrdSYMwvYsKw89BNFb12HXRJdUkC8_0",
    category: "Yoga",
  },
  {
    id: "fav-3",
    className: "Strength Foundations",
    trainerName: "Alex Johnson",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A",
    category: "Strength",
  },
];

async function fetchFavorites() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_FAVORITES;
}

async function removeFavorite(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id };
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
        <Image
          src={item.image}
          alt={item.className}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary-container/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
          <Icon icon={Star} size={12} />
          {item.category}
        </span>
      </div>

      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="font-anybody text-lg font-bold text-white">{item.className}</h3>
          <p className="mt-1 font-hanken text-sm text-on-surface-variant">
            Trainer:{" "}
            <span className="text-on-surface">{item.trainerName}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item)}
          className={cn(dashboardClasses.btnDanger, "w-full")}
        >
          <Icon icon={TrashBin} size={16} />
          Remove
        </button>
      </div>
    </motion.article>
  );
}

export default function UserFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchFavorites()
      .then((data) => {
        if (mounted) setFavorites(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;

    await removeFavorite(removeTarget.id);
    setFavorites((prev) => prev.filter((item) => item.id !== removeTarget.id));
    toast.success(`"${removeTarget.className}" removed from favorites.`);
  };

  if (loading) {
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
            Classes you have saved for quick access.
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
        confirmLabel="Remove"
      />
    </>
  );
}
