"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Person, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import Badge from "@/components/dashboard/ui/Badge";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function ProfileAvatar({ user, size = 96 }) {
  if (
    user?.image &&
    !user.image.startsWith("blob:") &&
    !user.image.startsWith("data:")
  ) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile"}
        className="rounded-2xl object-cover border-2 border-primary-container/40 shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile"}
        className="rounded-2xl object-cover border-2 border-primary-container/40 shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-2xl border-2 border-primary-container/40 bg-primary-container flex items-center justify-center text-on-primary-container font-anybody font-black text-3xl shadow-lg"
      style={{ width: size, height: size }}
    >
      {(user?.name || "U").charAt(0).toUpperCase()}
    </div>
  );
}

async function updateProfile(data) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, ...data };
}

/**
 * Shared profile settings form for all dashboard roles.
 */
export default function ProfilePage({ role = "user" }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      setLoading(false);
    }
  }, [user, reset]);

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors).find((field) => field?.message);
    toast.error(firstError?.message || "Please fix the invalid fields.");
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        name: data.name.trim(),
        phone: data.phone?.trim(),
        bio: data.bio?.trim(),
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (loading || !user) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/20">
            <Icon icon={Person} className="text-primary" size={22} />
          </div>
          <h2 className={dashboardClasses.pageTitle}>Profile Settings</h2>
        </div>
        <p className={dashboardClasses.pageSubtitle}>
          Manage your account information and personal details.
        </p>
      </header>

      <div className={cn(dashboardClasses.glassCard, "p-6 md:p-8")}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-primary-container/15">
          <ProfileAvatar user={user} />
          <div className="text-center sm:text-left">
            <h3 className="font-anybody text-xl font-bold text-white">{user.name}</h3>
            <p className="font-hanken text-sm text-on-surface-variant mt-1">{user.email}</p>
            <div className="mt-2">
              <Badge role={role} dot />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="mt-6 space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block font-geist-label text-label-bold text-on-surface">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={dashboardClasses.input}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
            />
            {errors.name && (
              <p className="text-error text-sm font-hanken">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-geist-label text-label-bold text-on-surface">
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled
              className={cn(dashboardClasses.input, "opacity-60 cursor-not-allowed")}
              {...register("email")}
            />
            <p className="font-hanken text-xs text-on-surface-variant">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block font-geist-label text-label-bold text-on-surface">
              Phone{" "}
              <span className="text-on-surface-variant font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={dashboardClasses.input}
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block font-geist-label text-label-bold text-on-surface">
              Bio{" "}
              <span className="text-on-surface-variant font-normal">(optional)</span>
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us a bit about yourself..."
              className={cn(dashboardClasses.input, "resize-none min-h-[100px]")}
              {...register("bio", {
                maxLength: { value: 300, message: "Bio must not exceed 300 characters" },
              })}
            />
            {errors.bio && (
              <p className="text-error text-sm font-hanken">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(dashboardClasses.btnPrimary, "flex-1 py-3")}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
              {!isSubmitting && <Icon icon={ArrowRight} size={18} />}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${role}`)}
              className={cn(dashboardClasses.btnSecondary, "flex-1 py-3")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
