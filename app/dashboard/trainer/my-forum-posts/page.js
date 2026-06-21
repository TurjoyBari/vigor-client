"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Comment, TrashBin, Plus } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import ConfirmationDialog from "@/components/dashboard/ui/ConfirmationDialog";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const INITIAL_POSTS = [
  {
    id: "post-1",
    title: "5 Recovery Tips After High-Intensity Training",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtCJNd7GGrZLAAM1Rl2NJf6X5sYijONIH94EItgwomRJU0NZhimF3Ghp-uURYwM7c0TMXr5543_WnhEAxKBzZDDwPN9AzkDL4Om-n1mHl5gB4w3diT_1yZiKZuoovGaOQo1pBQg2mnQCe9eJTGAsu9WwliavpvJl6rVISYTQhDrnU5TXTLeLjI4d9R04s0195ky9wMIA-LYNrq63370ug59nC-smrdSYMwvYsKw89BNFb12HXRJdUkC8_0",
    createdAt: "2026-06-12",
  },
  {
    id: "post-2",
    title: "How to Build Consistency in Your Fitness Routine",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A",
    createdAt: "2026-06-08",
  },
  {
    id: "post-3",
    title: "Nutrition Basics for Strength Athletes",
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
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon icon={Comment} className="text-on-surface-variant/40" size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
      </div>

      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="font-anybody text-lg font-bold text-white line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-1 font-hanken text-xs text-on-surface-variant">
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
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
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
    setPosts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    toast.success("Forum post deleted successfully.");
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
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className={dashboardClasses.pageTitle}>My Forum Posts</h2>
            <p className={dashboardClasses.pageSubtitle}>
              Manage posts you have shared with the community.
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
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Delete this post?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`
            : "Are you sure you want to delete this post?"
        }
        confirmLabel="Delete"
      />
    </>
  );
}
