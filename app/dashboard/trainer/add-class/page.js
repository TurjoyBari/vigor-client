"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Plus, Picture, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import { trainerApi } from "@/lib/dashboard/api";
import { syncBackendToken, unwrap } from "@/lib/publicApi";
import { HERO_IMAGE } from "@/lib/constants/images";
import { uploadImage } from "@/utils/uploadImage";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const CATEGORIES = [
  "HIIT",
  "Strength Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Cycling",
  "Boxing",
  "Mobility",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function TrainerAddClassPage() {
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
      className: "",
      category: "",
      difficulty: "",
      duration: "",
      schedule: "",
      price: "",
      description: "",
    },
  });

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors).find((field) => field?.message);
    toast.error(firstError?.message || "Please fix the invalid fields.");
  };

  const onSubmit = async (data) => {
    console.log("Form submitted");

    if (!session?.user) {
      toast.info("Please log in to create a class.");
      router.push("/login?redirect=/dashboard/trainer/add-class");
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
            toast.error("Failed to upload class image.");
            return;
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          toast.error("Failed to upload class image.");
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        className: data.className.trim(),
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration.trim(),
        schedule: data.schedule.trim(),
        price: parseFloat(data.price),
        description: data.description.trim(),
        image: imageUrl || HERO_IMAGE,
      };

      console.log("Form data:", payload);

      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user;

      console.log("Current User:", vigorUser);

      if (vigorUser?.role !== "trainer" && vigorUser?.role !== "admin") {
        toast.error("Only trainers can create classes. Please refresh your session.");
        return;
      }

      const response = await trainerApi.createClass(payload);
      const result = unwrap(response);
      const createdClass = result?.class;

      console.log("Class Created from DB:", createdClass);

      toast.success("Class created successfully!");
      setTimeout(() => router.push("/dashboard/trainer/my-classes"), 1500);
    } catch (error) {
      console.error("Failed to create class:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (!status || status === 401) {
        toast.error(message || "Please log in again and retry.");
      } else if (status !== 403 && status !== 400) {
        toast.error(message || "Failed to create class. Please try again.");
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const isBusy = submitting || uploading;

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6 md:space-y-8"
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/20">
            <Icon icon={Plus} className="text-primary" size={22} />
          </div>
          <h2 className={dashboardClasses.pageTitle}>Add Class</h2>
        </div>
        <p className={dashboardClasses.pageSubtitle}>
          Create a new fitness class for members to discover and enroll in.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="className" className="block font-geist-label text-label-bold text-on-surface">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              placeholder="e.g. HIIT Power Hour"
              className={dashboardClasses.input}
              {...register("className", {
                required: "Class name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
            />
            {errors.className && (
              <p className="text-error text-sm font-hanken">{errors.className.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block font-geist-label text-label-bold text-on-surface">
              Class Image
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
                    className="h-32 w-full max-w-xs object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Icon icon={Picture} className="text-outline group-hover:text-secondary" size={28} />
                    <p className="font-hanken text-sm text-on-surface-variant">
                      Click to upload class image
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block font-geist-label text-label-bold text-on-surface">
              Category
            </label>
            <select
              id="category"
              className={dashboardClasses.select}
              {...register("category", { required: "Category is required" })}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error text-sm font-hanken">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="block font-geist-label text-label-bold text-on-surface">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              className={dashboardClasses.select}
              {...register("difficulty", { required: "Difficulty level is required" })}
            >
              <option value="" disabled>Select difficulty</option>
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.difficulty && (
              <p className="text-error text-sm font-hanken">{errors.difficulty.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="block font-geist-label text-label-bold text-on-surface">
              Duration
            </label>
            <input
              id="duration"
              type="text"
              placeholder="e.g. 45 min"
              className={dashboardClasses.input}
              {...register("duration", {
                required: "Duration is required",
              })}
            />
            {errors.duration && (
              <p className="text-error text-sm font-hanken">{errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block font-geist-label text-label-bold text-on-surface">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="29.99"
              className={dashboardClasses.input}
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {errors.price && (
              <p className="text-error text-sm font-hanken">{errors.price.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="schedule" className="block font-geist-label text-label-bold text-on-surface">
              Schedule
            </label>
            <input
              id="schedule"
              type="text"
              placeholder="e.g. Mon, Wed, Fri · 7:00 AM"
              className={dashboardClasses.input}
              {...register("schedule", {
                required: "Schedule is required",
              })}
            />
            {errors.schedule && (
              <p className="text-error text-sm font-hanken">{errors.schedule.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="description" className="block font-geist-label text-label-bold text-on-surface">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe the class format, equipment needed, and what students can expect..."
              className={cn(dashboardClasses.input, "resize-none min-h-[120px]")}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-error text-sm font-hanken">{errors.description.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className={cn(dashboardClasses.btnPrimary, "w-full py-3.5")}
        >
          {uploading ? "Uploading image..." : submitting ? "Creating..." : "Create Class"}
          {!isBusy && <Icon icon={ArrowRight} size={18} />}
        </button>
      </form>
    </motion.div>
  );
}
