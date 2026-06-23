"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Comment,
  ArrowRight,
  Persons,
  ThumbsUp,
  ThumbsDown,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import Badge from "@/components/dashboard/ui/Badge";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function truncateText(text, max = 120) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostCoverImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-full items-center justify-center bg-primary-container/10">
        <Icon icon={Comment} className="text-on-surface-variant/30" size={48} />
      </div>
    );
  }

  if (src.startsWith("/")) {
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

  return (
    <img
      src={src}
      alt={alt}
      width={500}
      height={300}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function ForumPostCard({ post, index = 0 }) {
  const postId = post._id || post.id;

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
      <div className="relative h-44 w-full overflow-hidden bg-surface-container">
        <PostCoverImage src={post.image} alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/70 via-transparent to-transparent" />
        <span className="absolute top-3 right-3">
          <Badge role={post.authorRole} size="sm" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5 gap-3">
        <div className="space-y-2 flex-1">
          <h3 className="font-anybody text-lg font-bold text-white line-clamp-2">
            {post.title}
          </h3>
          <p className="flex items-center gap-1.5 font-hanken text-xs text-on-surface-variant">
            <Icon icon={Persons} size={14} className="text-secondary shrink-0" />
            <span className="truncate">{post.authorName}</span>
            {post.createdAt && (
              <>
                <span className="text-on-surface-variant/50">·</span>
                <span>{formatDate(post.createdAt)}</span>
              </>
            )}
          </p>
          <p className="font-hanken text-sm text-on-surface-variant leading-relaxed line-clamp-3">
            {truncateText(post.description)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-geist-label text-on-surface-variant border-t border-primary-container/15 pt-3">
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={ThumbsUp} size={14} className="text-secondary" />
            {post.likeCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={ThumbsDown} size={14} className="text-on-surface-variant" />
            {post.dislikeCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={Comment} size={14} className="text-primary" />
            {post.commentCount ?? 0}
          </span>
        </div>

        <Link
          href={`/forum/${postId}`}
          className={cn(dashboardClasses.btnSecondary, "w-full justify-center mt-auto")}
        >
          Read More
          <Icon icon={ArrowRight} size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
