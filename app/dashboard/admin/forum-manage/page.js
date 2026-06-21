"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Comment, TrashBin, Plus, LayoutList, LayoutColumns3 } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
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

const INITIAL_POSTS = [
  {
    id: "fp-1",
    title: "Platform Maintenance — June 22",
    author: "Admin User",
    authorRole: "admin",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtCJNd7GGrZLAAM1Rl2NJf6X5sYijONIH94EItgwomRJU0NZhimF3Ghp-uURYwM7c0TMXr5543_WnhEAxKBzZDDwPN9AzkDL4Om-n1mHl5gB4w3diT_1yZiKZuoovGaOQo1pBQg2mnQCe9eJTGAsu9WwliavpvJl6rVISYTQhDrnU5TXTLeLjI4d9R04s0195ky9wMIA-LYNrq63370ug59nC-smrdSYMwvYsKw89BNFb12HXRJdUkC8_0",
    createdAt: "2026-06-18",
  },
  {
    id: "fp-2",
    title: "5 Recovery Tips After High-Intensity Training",
    author: "Marcus Reed",
    authorRole: "trainer",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A",
    createdAt: "2026-06-15",
  },
  {
    id: "fp-3",
    title: "How to Build Consistency in Your Fitness Routine",
    author: "Sarah Chen",
    authorRole: "trainer",
    image: null,
    createdAt: "2026-06-12",
  },
  {
    id: "fp-4",
    title: "Welcome to VIGOR Community Forum!",
    author: "Admin User",
    authorRole: "admin",
    image: null,
    createdAt: "2026-06-01",
  },
];

async function fetchForumPosts() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return INITIAL_POSTS;
}

async function deleteForumPost(id) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, id };
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
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon icon={Comment} className="text-on-surface-variant/30" size={40} />
          </div>
        )}
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
        </div>
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
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchForumPosts()
      .then((data) => {
        if (mounted) setPosts(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    await deleteForumPost(deleteTarget.id);
    setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success("Forum post deleted successfully.");
  };

  const columns = useMemo(
    () => [
      {
        key: "post",
        label: "Post",
        render: (row) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
              {row.image ? (
                <Image
                  src={row.image}
                  alt={row.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Icon icon={Comment} size={18} className="text-on-surface-variant" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{row.title}</p>
              <p className="font-hanken text-xs text-on-surface-variant">{row.createdAt}</p>
            </div>
          </div>
        ),
      },
      {
        key: "author",
        label: "Author",
        render: (row) => (
          <div>
            <p className="text-on-surface">{row.author}</p>
            <Badge role={row.authorRole} size="sm" />
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
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
              Moderate all community forum posts across the platform.
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
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete forum post?"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.title}" by ${deleteTarget.author}? This cannot be undone.`
            : "Are you sure you want to delete this post?"
        }
        confirmLabel="Delete Post"
      />
    </>
  );
}
