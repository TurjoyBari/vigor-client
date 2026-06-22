"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowShapeTurnUpLeft,
  Comment,
  PaperPlane,
  Pencil,
  Persons,
  ThumbsDown,
  ThumbsDownFill,
  ThumbsUp,
  ThumbsUpFill,
  TrashBin,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import Badge from "@/components/dashboard/ui/Badge";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PostCoverImage({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-full items-center justify-center bg-primary-container/10">
        <Icon icon={Comment} className="text-on-surface-variant/30" size={64} />
      </div>
    );
  }

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 70vw"
        priority
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function CommentForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  submitLabel,
  disabled,
}) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={disabled}
        className={cn(
          dashboardClasses.input,
          "w-full resize-none text-sm min-h-[88px]"
        )}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className={cn(dashboardClasses.btnSecondary, "text-xs py-2 px-4")}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className={cn(dashboardClasses.btnPrimary, "text-xs py-2 px-4")}
        >
          <Icon icon={PaperPlane} size={14} />
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  depth = 0,
  actionLoading,
  replyingTo,
  editingId,
  replyDraft,
  editDraft,
  onReplyDraftChange,
  onEditDraftChange,
  onStartReply,
  onCancelReply,
  onStartEdit,
  onCancelEdit,
  onSubmitReply,
  onSubmitEdit,
  onDelete,
  requireAuth,
}) {
  const isOwner = currentUserId && String(comment.userId) === String(currentUserId);
  const isReplying = replyingTo === comment.id;
  const isEditing = editingId === comment.id;

  return (
    <div
      className={cn(
        "space-y-3",
        depth > 0 && "ml-4 md:ml-8 pl-4 border-l border-primary-container/20"
      )}
    >
      <div className="rounded-xl border border-primary-container/15 bg-primary-container/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-hanken text-sm font-medium text-white">{comment.author}</p>
            <p className="font-hanken text-xs text-on-surface-variant mt-0.5">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onStartEdit(comment)}
                disabled={actionLoading}
                className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-colors"
                aria-label="Edit comment"
              >
                <Icon icon={Pencil} size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                disabled={actionLoading}
                className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                aria-label="Delete comment"
              >
                <Icon icon={TrashBin} size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <CommentForm
              value={editDraft}
              onChange={onEditDraftChange}
              onSubmit={() => onSubmitEdit(comment.id)}
              onCancel={onCancelEdit}
              placeholder="Edit your comment..."
              submitLabel="Save"
              disabled={actionLoading}
            />
          </div>
        ) : (
          <p className="mt-3 font-hanken text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        {!isEditing && depth === 0 && (
          <button
            type="button"
            onClick={() => {
              if (!requireAuth()) return;
              onStartReply(comment.id);
            }}
            disabled={actionLoading}
            className="mt-3 inline-flex items-center gap-1.5 font-geist-label text-xs text-secondary hover:text-primary transition-colors"
          >
            <Icon icon={ArrowShapeTurnUpLeft} size={14} />
            Reply
          </button>
        )}
      </div>

      {isReplying && (
        <CommentForm
          value={replyDraft}
          onChange={onReplyDraftChange}
          onSubmit={() => onSubmitReply(comment.id)}
          onCancel={onCancelReply}
          placeholder="Write a reply..."
          submitLabel="Reply"
          disabled={actionLoading}
        />
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          depth={depth + 1}
          actionLoading={actionLoading}
          replyingTo={replyingTo}
          editingId={editingId}
          replyDraft={replyDraft}
          editDraft={editDraft}
          onReplyDraftChange={onReplyDraftChange}
          onEditDraftChange={onEditDraftChange}
          onStartReply={onStartReply}
          onCancelReply={onCancelReply}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSubmitReply={onSubmitReply}
          onSubmitEdit={onSubmitEdit}
          onDelete={onDelete}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
}

export default function ForumPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const { data: session } = useSession();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userReaction, setUserReaction] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const loadPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await publicApi.forum.getPostById(postId);
      const data = unwrap(response);
      setPost(data?.post || null);
      setComments(data?.comments || []);
    } catch {
      setPost(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const requireAuth = useCallback(() => {
    if (session?.user) return true;
    toast.info("Please log in to interact with this post.");
    router.push(`/login?redirect=/forum/${postId}`);
    return false;
  }, [session?.user, router, postId]);

  const runProtectedAction = async (action) => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      await syncBackendToken(session.user);
      await action();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLike = () => {
    runProtectedAction(async () => {
      const response = await publicApi.forum.likePost(postId);
      const data = unwrap(response);
      if (data?.post) setPost(data.post);
      setUserReaction((prev) => (prev === "like" ? null : "like"));
    });
  };

  const handleDislike = () => {
    runProtectedAction(async () => {
      const response = await publicApi.forum.dislikePost(postId);
      const data = unwrap(response);
      if (data?.post) setPost(data.post);
      setUserReaction((prev) => (prev === "dislike" ? null : "dislike"));
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    runProtectedAction(async () => {
      await publicApi.forum.addComment(postId, newComment.trim());
      setNewComment("");
      toast.success("Comment posted");
      await loadPost();
    });
  };

  const handleSubmitReply = (commentId) => {
    if (!replyDraft.trim()) return;
    runProtectedAction(async () => {
      await publicApi.forum.replyComment(commentId, replyDraft.trim());
      setReplyingTo(null);
      setReplyDraft("");
      toast.success("Reply posted");
      await loadPost();
    });
  };

  const handleSubmitEdit = (commentId) => {
    if (!editDraft.trim()) return;
    runProtectedAction(async () => {
      await publicApi.forum.editComment(commentId, editDraft.trim());
      setEditingId(null);
      setEditDraft("");
      toast.success("Comment updated");
      await loadPost();
    });
  };

  const handleDeleteComment = (commentId) => {
    runProtectedAction(async () => {
      await publicApi.forum.deleteComment(commentId);
      toast.success("Comment deleted");
      await loadPost();
    });
  };

  const handleStartEdit = (comment) => {
    if (!requireAuth()) return;
    setEditingId(comment.id);
    setEditDraft(comment.content);
    setReplyingTo(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="h-8 w-40 rounded-lg bg-surface-container/40 animate-pulse mb-6" />
          <div className="h-[320px] rounded-[20px] bg-surface-container/40 animate-pulse mb-8" />
          <div className="h-48 rounded-[20px] bg-surface-container/40 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0B1120] pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center py-20">
          <h1 className="font-anybody text-3xl font-bold text-white">Post not found</h1>
          <Link
            href="/community-forum"
            className={cn(dashboardClasses.btnPrimary, "inline-flex mt-6")}
          >
            Back to Forum
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] pt-28 pb-16 md:pb-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <Link
          href="/community-forum"
          className="inline-flex items-center gap-2 font-geist-label text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <Icon icon={ArrowLeft} size={16} />
          Back to Community Forum
        </Link>

        <motion.article
          initial={DASHBOARD_ANIMATION.fadeIn.initial}
          animate={DASHBOARD_ANIMATION.fadeIn.animate}
          transition={DASHBOARD_ANIMATION.fadeIn.transition}
          className="space-y-8"
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[20px] overflow-hidden border border-primary-container/20 bg-surface-container">
            <PostCoverImage src={post.image} alt={post.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/90 via-[#0B1120]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <Badge role={post.authorRole} size="sm" className="mb-3" />
              <h1 className="font-anybody text-3xl md:text-5xl font-black text-white italic leading-tight">
                {post.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 font-hanken text-sm text-on-surface-variant">
                <Icon icon={Persons} size={16} className="text-secondary" />
                <span className="text-white font-medium">{post.author}</span>
                {post.createdAt && (
                  <>
                    <span className="text-on-surface-variant/50">·</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}>
            <div>
              <h2 className="font-geist-label text-label-bold uppercase tracking-wider text-on-surface-variant mb-3">
                Post
              </h2>
              <p className="font-hanken text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary-container/15">
              <button
                type="button"
                onClick={handleLike}
                disabled={actionLoading}
                className={cn(
                  dashboardClasses.btnSecondary,
                  "text-sm",
                  userReaction === "like" && "border-secondary/40 text-secondary"
                )}
              >
                <Icon icon={userReaction === "like" ? ThumbsUpFill : ThumbsUp} size={16} />
                {post.likes ?? 0}
              </button>
              <button
                type="button"
                onClick={handleDislike}
                disabled={actionLoading}
                className={cn(
                  dashboardClasses.btnSecondary,
                  "text-sm",
                  userReaction === "dislike" && "border-error/40 text-error"
                )}
              >
                <Icon
                  icon={userReaction === "dislike" ? ThumbsDownFill : ThumbsDown}
                  size={16}
                />
                {post.dislikes ?? 0}
              </button>
              <span className="font-hanken text-sm text-on-surface-variant flex items-center gap-1.5 ml-auto">
                <Icon icon={Comment} size={16} />
                {post.commentCount ?? comments.length} comment
                {(post.commentCount ?? comments.length) === 1 ? "" : "s"}
              </span>
            </div>

            {!session?.user && (
              <p className="font-hanken text-sm text-on-surface-variant rounded-xl bg-primary-container/5 border border-primary-container/15 px-4 py-3">
                <Link href={`/login?redirect=/forum/${postId}`} className="text-primary hover:underline">
                  Log in
                </Link>{" "}
                to like, dislike, or join the discussion.
              </p>
            )}
          </div>

          <section className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}>
            <h2 className="font-anybody text-xl font-bold text-white">Comments</h2>

            {session?.user ? (
              <CommentForm
                value={newComment}
                onChange={setNewComment}
                onSubmit={handleAddComment}
                placeholder="Share your thoughts..."
                submitLabel="Post Comment"
                disabled={actionLoading}
              />
            ) : (
              <p className="font-hanken text-sm text-on-surface-variant">
                <Link href={`/login?redirect=/forum/${postId}`} className="text-primary hover:underline">
                  Log in
                </Link>{" "}
                to post a comment.
              </p>
            )}

            {comments.length === 0 ? (
              <p className="font-hanken text-sm text-on-surface-variant text-center py-8">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={session?.user?.id}
                    actionLoading={actionLoading}
                    replyingTo={replyingTo}
                    editingId={editingId}
                    replyDraft={replyDraft}
                    editDraft={editDraft}
                    onReplyDraftChange={setReplyDraft}
                    onEditDraftChange={setEditDraft}
                    onStartReply={setReplyingTo}
                    onCancelReply={() => {
                      setReplyingTo(null);
                      setReplyDraft("");
                    }}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={() => {
                      setEditingId(null);
                      setEditDraft("");
                    }}
                    onSubmitReply={handleSubmitReply}
                    onSubmitEdit={handleSubmitEdit}
                    onDelete={handleDeleteComment}
                    requireAuth={requireAuth}
                  />
                ))}
              </div>
            )}
          </section>
        </motion.article>
      </div>
    </main>
  );
}
