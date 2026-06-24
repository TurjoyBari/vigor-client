"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Comment, TrashBin, Plus, LayoutList, LayoutColumns3 } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
import DataTable from "@/components/dashboard/ui/DataTable";
import Badge from "@/components/dashboard/ui/Badge";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
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

function mapPost(post) {
  return {
    id: post.id,
    title: post.title || "Untitled",
    image: post.image || null,
    author: post.authorName || post.author || post.trainerName || "Unknown",
    authorRole: post.authorRole || "trainer",
    likes: post.likes ?? post.likeCount ?? 0,
    createdAt: formatCreatedAt(post.createdAt),
  };
}

function PostThumbnail({ src, alt }) {
  const isLocal = src?.startsWith("/");

  if (isLocal && src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="h-12 w-12 rounded-lg object-cover border border-primary-container/20"
      />
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-12 w-12 rounded-lg object-cover border border-primary-container/20"
      />
    );
  }

  return (
    <div className="h-12 w-12 rounded-lg bg-surface-container-low border border-primary-container/20 flex items-center justify-center">
      <Icon icon={Comment} size={18} className="text-on-surface-variant" />
    </div>
  );
}

function PostGridImage({ src, alt }) {
  const isLocal = src?.startsWith("/");

  if (isLocal && src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Icon icon={Comment} className="text-on-surface-variant/30" size={40} />
    </div>
  );
}

function PostGridCard({ post, index, onDelete }) {
  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "overflow-hidden group"
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-36 w-full overflow-hidden bg-surface-container-low">
        <PostGridImage src={post.image} alt={post.title} />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-anybody font-bold text-white line-clamp-2">{post.title}</h3>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-hanken text-xs text-on-surface-variant truncate">
              {post.author}
            </p>
            <Badge role={post.authorRole} size="sm" />
          </div>
          <span className="font-geist-label text-xs text-on-surface-variant shrink-0">
            {post.likes} likes
          </span>
        </div>
        <p className="font-hanken text-xs text-on-surface-variant">{post.createdAt}</p>
        <button
          type="button"
          onClick={() => onDelete(post)}
          className={cn(dashboardClasses.btnDanger, "w-full text-xs py-2")}
        >
          <Icon icon={TrashBin} size={14} />
          Delete
        </button>
      </div>
    </motion.article>
  );
}

export default function AdminForumManagePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

      const response = await adminApi.getForumPosts();
      const data = unwrap(response);
      const postsFromDb = (data?.posts || []).map(mapPost);

      console.log("Forum posts from DB:", postsFromDb);

      setPosts(postsFromDb);
    } catch (error) {
      console.error("Failed to load forum posts:", error);
      console.log(error.response);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user, sessionPending]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
    setSubmitting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      if (session?.user) {
        await syncBackendToken(session.user);
      }

      await adminApi.deleteForumPost(deleteTarget.id);

      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Forum post deleted successfully");
      closeDeleteDialog();
    } catch (error) {
      console.error("Delete forum post failed:", error);
      console.log(error.response);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (row) => <PostThumbnail src={row.image} alt={row.title} />,
      },
      {
        key: "title",
        label: "Title",
        render: (row) => (
          <span className="font-semibold text-white">{row.title}</span>
        ),
      },
      {
        key: "author",
        label: "Author",
        render: (row) => (
          <span className="text-on-surface">{row.author}</span>
        ),
      },
      {
        key: "authorRole",
        label: "Role",
        render: (row) => <Badge role={row.authorRole} size="sm" />,
      },
      {
        key: "likes",
        label: "Likes",
        render: (row) => (
          <span className="font-geist-label text-sm font-bold text-white">
            {row.likes}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (row) => (
          <span className="font-hanken text-sm text-on-surface-variant">
            {row.createdAt}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Action",
        render: (row) => (
          <button
            type="button"
            className={cn(dashboardClasses.btnDanger, "px-3 py-2 text-xs")}
            onClick={() => {
              setDeleteTarget(row);
              setDeleteOpen(true);
            }}
          >
            <Icon icon={TrashBin} size={14} />
            Delete
          </button>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSkeleton variant="page" />;
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
            <h2 className={dashboardClasses.pageTitle}>Forum Manage</h2>
            <p className={dashboardClasses.pageSubtitle}>
              All trainer and admin posts from the MongoDB forumPosts collection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-primary-container/20 p-1 bg-surface-container-low/60">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-geist-label font-semibold transition",
                  viewMode === "table"
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-white"
                )}
              >
                <Icon icon={LayoutList} size={14} />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-geist-label font-semibold transition",
                  viewMode === "grid"
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-white"
                )}
              >
                <Icon icon={LayoutColumns3} size={14} />
                Grid
              </button>
            </div>

            <Link href="/dashboard/admin/add-forum-post" className={dashboardClasses.btnPrimary}>
              <Icon icon={Plus} size={16} />
              New Post
            </Link>
          </div>
        </header>

        {posts.length === 0 ? (
          <EmptyState
            preset="posts"
            actionHref="/dashboard/admin/add-forum-post"
            actionLabel="Create Announcement"
          />
        ) : viewMode === "table" ? (
          <DataTable columns={columns} data={posts} rowKey="id" />
        ) : (
          <div className={dashboardClasses.gridCards}>
            {posts.map((post, index) => (
              <PostGridCard
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
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete forum post?"
        message="Are you sure you want to delete this forum post?"
        confirmLabel={submitting ? "Deleting..." : "Delete Post"}
      />
    </>
  );
}
