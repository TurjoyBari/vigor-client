"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Comment } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import ForumPostCard from "@/components/forum/ForumPostCard";
import publicApi, { unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const PAGE_SIZE = 9;

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export default function CommunityForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicApi.forum.getPosts({
        page: currentPage,
        limit: PAGE_SIZE,
      });
      const data = unwrap(response);

      setPosts(data?.posts || []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    } catch (fetchError) {
      console.error("Failed to fetch forum posts:", fetchError);
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
      setError("Unable to load forum posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, loading]);

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const resultLabel = loading
    ? "Loading posts..."
    : error
      ? "Failed to load posts"
      : `${total} post${total === 1 ? "" : "s"}`;

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
          {resultLabel}
          {!loading && !error && totalPages > 1
            ? ` · Page ${currentPage} of ${totalPages}`
            : ""}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[20px] border border-primary-container/20 bg-surface-container/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div
            className={cn(
              dashboardClasses.glassCard,
              "py-14 text-center px-6 space-y-4"
            )}
          >
            <p className="font-hanken text-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={fetchPosts}
              className={cn(dashboardClasses.btnSecondary, "inline-flex")}
            >
              Try Again
            </button>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {posts.map((post, index) => (
                <ForumPostCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Forum pagination"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage <= 1}
                  className={cn(
                    dashboardClasses.btnSecondary,
                    "px-3 py-2 text-xs",
                    currentPage <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon icon={ChevronLeft} size={16} />
                  Prev
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[2.25rem] rounded-lg px-3 py-2 text-xs font-geist-label font-semibold border transition",
                      page === currentPage
                        ? "bg-primary-container text-on-primary-container border-primary-container"
                        : "border-primary-container/30 text-on-surface-variant hover:text-white"
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className={cn(
                    dashboardClasses.btnSecondary,
                    "px-3 py-2 text-xs",
                    currentPage >= totalPages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Next
                  <Icon icon={ChevronRight} size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
