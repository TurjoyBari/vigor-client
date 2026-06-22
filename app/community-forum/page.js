"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Comment } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import ForumPostCard from "@/components/forum/ForumPostCard";
import publicApi, { unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

export default function CommunityForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await publicApi.forum.getPosts();
      const data = unwrap(response);
      setPosts(data?.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.header
          className="mb-8 md:mb-12"
          initial={DASHBOARD_ANIMATION.fadeIn.initial}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={DASHBOARD_ANIMATION.fadeIn.transition}
        >
          <p className="font-geist-label text-label-sm uppercase tracking-[0.2em] text-secondary mb-3">
            VIGOR Community
          </p>
          <h1 className="font-anybody text-3xl md:text-5xl font-black text-white italic tracking-tight">
            Community Forum
          </h1>
          <p className="mt-3 font-hanken text-body-lg text-on-surface-variant max-w-2xl">
            Insights, tips, and updates from VIGOR trainers and admins. Join the
            conversation and level up your training.
          </p>
        </motion.header>

        <p className="mb-6 font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
          {loading
            ? "Loading posts..."
            : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[20px] border border-primary-container/20 bg-surface-container/40 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className={cn(dashboardClasses.glassCard, "py-16 text-center px-6")}>
            <Icon icon={Comment} size={40} className="text-on-surface-variant/40 mx-auto mb-4" />
            <p className="font-anybody text-xl font-bold text-white">No posts yet</p>
            <p className="mt-2 font-hanken text-sm text-on-surface-variant">
              Trainers and admins will share updates here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post, index) => (
              <ForumPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
