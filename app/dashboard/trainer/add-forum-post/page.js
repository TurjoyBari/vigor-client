"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Comment, Picture, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { uploadImage } from "@/utils/uploadImage";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

async function createForumPost(payload) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, id: `post-${Date.now()}`, ...payload };
}

export default function TrainerAddForumPostPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors).find((field) => field?.message);
    toast.error(firstError?.message || "Please fix the invalid fields.");
  };

  const onSubmit = async (data) => {
    let imageUrl = null;

    if (data.image?.[0]) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(data.image[0]);
      } catch {
        toast.error("Failed to upload post image.");
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      await createForumPost({
        title: data.title.trim(),
        description: data.description.trim(),
        image: imageUrl,
      });

      toast.success("Forum post published successfully!");
      setTimeout(() => router.push("/dashboard/trainer/my-forum-posts"), 1500);
    } catch {
      toast.error("Failed to publish post. Please try again.");
    }
  };

  const isBusy = isSubmitting || uploading;

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15">
            <Icon icon={Comment} className="text-secondary" size={22} />
          </div>
          <h2 className={dashboardClasses.pageTitle}>Add Forum Post</h2>
        </div>
        <p className={dashboardClasses.pageSubtitle}>
          Share tips, updates, and insights with the VIGOR community.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}
      >
        <div className="space-y-2">
          <label htmlFor="title" className="block font-geist-label text-label-bold text-on-surface">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. 5 Tips for Better Recovery After HIIT"
            className={dashboardClasses.input}
            {...register("title", {
              required: "Title is required",
              minLength: { value: 5, message: "Title must be at least 5 characters" },
              maxLength: { value: 120, message: "Title must not exceed 120 characters" },
            })}
          />
          {errors.title && (
            <p className="text-error text-sm font-hanken">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-geist-label text-label-bold text-on-surface">
            Image{" "}
            <span className="text-on-surface-variant font-normal">(optional)</span>
          </label>
          <div className="group relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            <div className="w-full border-2 border-dashed border-primary-container/30 rounded-xl py-8 flex flex-col items-center justify-center gap-2 group-hover:border-secondary/50 transition-colors">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full max-w-md object-cover rounded-lg"
                />
              ) : (
                <>
                  <Icon icon={Picture} className="text-outline group-hover:text-secondary" size={28} />
                  <p className="font-hanken text-sm text-on-surface-variant">
                    Click to upload a cover image
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-geist-label text-label-bold text-on-surface">
            Description
          </label>
          <textarea
            id="description"
            rows={8}
            placeholder="Write your post content here. Share training advice, class updates, or community announcements..."
            className={cn(dashboardClasses.input, "resize-none min-h-[180px]")}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 30,
                message: "Description must be at least 30 characters",
              },
              maxLength: {
                value: 3000,
                message: "Description must not exceed 3000 characters",
              },
            })}
          />
          {errors.description && (
            <p className="text-error text-sm font-hanken">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className={cn(dashboardClasses.btnPrimary, "w-full py-3.5")}
        >
          {uploading ? "Uploading image..." : isSubmitting ? "Publishing..." : "Publish Post"}
          {!isBusy && <Icon icon={ArrowRight} size={18} />}
        </button>
      </form>
    </motion.div>
  );
}
