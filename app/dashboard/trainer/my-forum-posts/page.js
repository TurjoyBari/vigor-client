"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Comment, TrashBin, Plus } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { trainerApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function formatCreatedAt(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateDescription(text, maxLength = 120) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}...`;
}

function mapPost(post) {
  return {
    id: post.id,
    title: post.title,
    description: post.description || "",
    image: post.image,
    createdAt: formatCreatedAt(post.createdAt),
  };
}

function PostImage({ src, alt }) {
  const isLocal = src?.startsWith("/");

  if (isLocal && src) {
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

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Icon icon={Comment} className="text-on-surface-variant/40" size={48} />
    </div>
  );
}

function PostCard({ post, index, onDelete }) {
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
      <div className="relative h-44 w-full overflow-hidden bg-surface-container-low">
        <PostImage src={post.image} alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
      </div>

      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="font-anybody text-lg font-bold text-white line-clamp-2">
            {post.title}
          </h3>
          {post.description && (
            <p className="mt-2 font-hanken text-sm text-on-surface-variant line-clamp-3">
              {truncateDescription(post.description)}
            </p>
          )}
          <p className="mt-2 font-hanken text-xs text-on-surface-variant">
            Published {post.createdAt}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(post)}
          className={cn(dashboardClasses.btnDanger, "w-full")}
        >
          <Icon icon={TrashBin} size={16} />
          Delete
        </button>
      </div>
    </motion.article>
  );
}

export default function TrainerMyForumPostsPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!session?.user) {
      if (!sessionPending) {
        setPosts([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await syncBackendToken(session.user);

      const response = await trainerApi.getForumPosts();
      const data = unwrap(response);
      const postData = (data?.posts || []).map(mapPost);

      console.log("Trainer forum posts from DB:", postData);

      setPosts(postData);
    } catch (error) {
      console.error("Failed to load forum posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      await trainerApi.deleteForumPost(deleteTarget.id);
      setPosts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success("Forum post deleted successfully.");
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete forum post:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (sessionPending || loading) {
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
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className={dashboardClasses.pageTitle}>My Forum Posts</h2>
            <p className={dashboardClasses.pageSubtitle}>
              Your posts from MongoDB forumPosts — filtered by your trainer account.
            </p>
          </div>
          <Link
            href="/dashboard/trainer/add-forum-post"
            className={dashboardClasses.btnPrimary}
          >
            <Icon icon={Plus} size={18} />
            New Post
          </Link>
        </header>

        {posts.length === 0 ? (
          <EmptyState
            preset="posts"
            actionHref="/dashboard/trainer/add-forum-post"
            actionLabel="Create Post"
          />
        ) : (
          <div className={dashboardClasses.gridCards}>
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onDelete={(target) => {
                  setDeleteTarget(target);
                  setDeleteOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      <ConfirmationDialog
        isOpen={deleteOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete this post?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`
            : "Are you sure you want to delete this post?"
        }
        confirmLabel={deleting ? "Deleting..." : "Delete"}
      />
    </>
  );
}
