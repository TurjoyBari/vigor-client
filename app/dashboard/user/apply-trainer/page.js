"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { GraduationCap, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/auth-client";
import publicApi, { syncBackendToken, unwrap } from "@/lib/publicApi";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const SPECIALTY_OPTIONS = [
  "HIIT",
  "Strength Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Cycling",
  "Boxing",
  "Nutrition Coaching",
  "Mobility & Recovery",
  "Other",
];

export default function ApplyTrainerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      experience: "",
      specialty: "",
      customSpecialty: "",
    },
  });

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors).find((field) => field?.message);
    toast.error(firstError?.message || "Please fix the invalid fields.");
  };

  const onSubmit = async (data) => {
    if (!session?.user) {
      toast.info("Please log in to submit an application.");
      router.push("/login?redirect=/dashboard/user/apply-trainer");
      return;
    }

    const specialty =
      data.specialty === "Other"
        ? data.customSpecialty.trim()
        : data.specialty;

    if (!specialty) {
      toast.error("Please specify your specialty.");
      return;
    }

    setSubmitting(true);
    try {
      const authData = await syncBackendToken(session.user);
      const vigorUser = authData?.user || session.user;

      console.log("Current User:", vigorUser);

      const response = await publicApi.trainerApplications.submit({
        experience: data.experience.trim(),
        specialty,
      });

      const result = unwrap(response);
      const application = result?.application;

      console.log("Application Submitted:", application);

      toast.success("Trainer application submitted successfully!");
      setTimeout(() => router.push("/dashboard/user"), 1500);
    } catch (error) {
      console.error("Failed to submit trainer application:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (!status || status === 401) {
        toast.error(message || "Please log in again and retry your application.");
      } else if (status !== 403 && status !== 409 && status !== 400) {
        toast.error(message || "Failed to submit application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            <Icon icon={GraduationCap} className="text-secondary" size={22} />
          </div>
          <h2 className={dashboardClasses.pageTitle}>Apply as Trainer</h2>
        </div>
        <p className={dashboardClasses.pageSubtitle}>
          Share your experience and specialty. Our admin team will review your
          application within 3–5 business days.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={cn(dashboardClasses.glassCard, "p-6 md:p-8 space-y-6")}
      >
        <div className="space-y-2">
          <label
            htmlFor="experience"
            className="block font-geist-label text-label-bold text-on-surface"
          >
            Experience
          </label>
          <textarea
            id="experience"
            rows={5}
            placeholder="Describe your coaching background, certifications, years of experience, and training philosophy..."
            className={cn(dashboardClasses.input, "resize-none min-h-[140px]")}
            {...register("experience", {
              required: "Experience is required",
              minLength: {
                value: 20,
                message: "Please provide at least 20 characters of experience detail",
              },
              maxLength: {
                value: 1000,
                message: "Experience must not exceed 1000 characters",
              },
            })}
          />
          {errors.experience && (
            <p className="text-error text-sm font-hanken">{errors.experience.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="specialty"
            className="block font-geist-label text-label-bold text-on-surface"
          >
            Specialty
          </label>
          <select
            id="specialty"
            className={dashboardClasses.select}
            {...register("specialty", {
              required: "Please select a specialty",
            })}
          >
            <option value="" disabled>
              Select your primary specialty
            </option>
            {SPECIALTY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.specialty && (
            <p className="text-error text-sm font-hanken">{errors.specialty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="customSpecialty"
            className="block font-geist-label text-label-bold text-on-surface"
          >
            Custom Specialty{" "}
            <span className="text-on-surface-variant font-normal">(if Other)</span>
          </label>
          <input
            id="customSpecialty"
            type="text"
            placeholder="e.g. Olympic Weightlifting, Pre/Post Natal Fitness"
            className={dashboardClasses.input}
            {...register("customSpecialty", {
              validate: (value, formValues) => {
                if (formValues.specialty === "Other" && !value.trim()) {
                  return "Please specify your custom specialty";
                }
                return true;
              },
            })}
          />
          {errors.customSpecialty && (
            <p className="text-error text-sm font-hanken">
              {errors.customSpecialty.message}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-primary-container/20 bg-primary-container/5 p-4">
          <p className="font-hanken text-sm text-on-surface-variant">
            By submitting, you confirm that the information provided is accurate.
            Approved trainers gain access to class creation, student management, and
            community forum posting.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={cn(dashboardClasses.btnPrimary, "w-full py-3.5")}
        >
          {submitting ? "Submitting..." : "Submit Application"}
          {!submitting && <Icon icon={ArrowRight} size={18} />}
        </button>
      </form>
    </motion.div>
  );
}
