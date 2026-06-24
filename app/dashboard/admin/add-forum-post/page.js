"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Comment, Picture, ArrowRight, Shield } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
import { uploadImage } from "@/utils/uploadImage";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

export default function AdminAddForumPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    console.log("Forum form submitted");

    if (!session?.user) {
      toast.info("Please log in to publish an announcement.");
      router.push("/login?redirect=/dashboard/admin/add-forum-post");
      return;
    }

    setSubmitting(true);
    let imageUrl = null;

    try {
      if (data.image?.[0]) {
        try {
          setUploading(true);
          imageUrl = await uploadImage(data.image[0]);
          if (!imageUrl) {
            toast.error("Failed to upload post image.");
            return;
          }
        } catch (error) {
          console.error("Forum image upload failed:", error);
          toast.error("Failed to upload post image.");
          return;
        } finally {
          setUploading(false);
        }
      }

      const formData = {
        title: data.title.trim(),
        description: data.description.trim(),
        image: imageUrl,
      };

      console.log(formData);

      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      console.log("Current admin:", vigorUser);

      if (vigorUser?.role !== "admin") {
        toast.error("Only admins can publish official announcements.");
        return;
      }

      const response = await adminApi.createForumPost(formData);
      const result = unwrap(response);
      const post = result?.post;

      console.log("Forum post created in DB:", post);

      toast.success("Official announcement published successfully!");
      setTimeout(() => router.push("/dashboard/admin/forum-manage"), 1500);
    } catch (error) {
      console.error("Failed to publish forum post:", error);
      console.log(error.response);
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || uploading;

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B00]/15">
            <Icon icon={Shield} className="text-[#FF6B00]" size={22} />
          </div>
          <h2 className={dashboardClasses.pageTitle}>Add Forum Post</h2>
        </div>
        <p className={dashboardClasses.pageSubtitle}>
          Publish official announcements and platform updates to the VIGOR community.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}
      >
        <div className="rounded-xl border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-4 flex items-start gap-3">
          <Icon icon={Comment} className="text-[#FF6B00] shrink-0 mt-0.5" size={18} />
          <p className="font-hanken text-sm text-on-surface-variant">
            Posts created here appear as official admin announcements and are
            highlighted in the community forum.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="block font-geist-label text-label-bold text-on-surface">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. New Class Schedule — July 2026"
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
            <div className="w-full border-2 border-dashed border-primary-container/30 rounded-xl py-8 flex flex-col items-center justify-center gap-2 group-hover:border-[#FF6B00]/40 transition-colors">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full max-w-md object-cover rounded-lg"
                />
              ) : (
                <>
                  <Icon icon={Picture} className="text-outline group-hover:text-[#FF6B00]" size={28} />
                  <p className="font-hanken text-sm text-on-surface-variant">
                    Click to upload announcement image
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
            placeholder="Write the full announcement content here..."
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
          {uploading ? "Uploading image..." : submitting ? "Publishing..." : "Publish Announcement"}
          {!isBusy && <Icon icon={ArrowRight} size={18} />}
        </button>
      </form>
    </motion.div>
  );
}
