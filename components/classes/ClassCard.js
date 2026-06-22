"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutList, Persons, Clock } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
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

function ClassCardImage({ src, alt }) {
  const isLocal =
    src &&
    !src.startsWith("blob:") &&
    !src.startsWith("data:") &&
    (src.startsWith("/") || src.startsWith("http"));

  if (isLocal && src.startsWith("/")) {
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

  if (isLocal) {
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

export default function ClassCard({ classItem, index = 0 }) {
  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "overflow-hidden group flex flex-col"
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-surface-container">
        <ClassCardImage src={classItem.image} alt={classItem.className} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-primary-container/90 px-2.5 py-1 text-[10px] font-geist-label font-bold uppercase tracking-wider text-on-primary-container">
          {classItem.category}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-[#0B1120]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-xs font-bold text-secondary">
          {formatPrice(classItem.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5 gap-4">
        <div className="space-y-2">
          <h3 className="font-anybody text-lg font-bold text-white line-clamp-2">
            {classItem.className}
          </h3>
          <p className="flex items-center gap-1.5 font-hanken text-sm text-on-surface-variant">
            <Icon icon={Persons} size={14} className="text-secondary shrink-0" />
            <span className="truncate">{classItem.trainer}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-geist-label text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Icon icon={Clock} size={14} className="text-primary" />
            {classItem.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon={LayoutList} size={14} className="text-primary" />
            {classItem.bookingCount ?? 0} booked
          </span>
        </div>

        <Link
          href={`/classes/${classItem.id}`}
          className={cn(dashboardClasses.btnPrimary, "w-full mt-auto text-center")}
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
