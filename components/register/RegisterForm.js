"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input, Label } from "@heroui/react";
import {
  Person,
  Envelope,
  Picture,
  Lock,
  Eye,
  EyeSlash,
  ArrowRight,
} from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import GoogleIcon from "../login/GoogleIcon";
import { signUp, signIn } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { uploadImage } from "@/utils/uploadImage";

const VALID_ROLES = ["user", "trainer"];

function FieldIcon({ icon, focused }) {
  return (
    <span
      className={`register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-outline snappy-transition pointer-events-none ${
        focused ? "text-primary" : ""
      }`}
    >
      <Icon icon={icon} size={20} />
    </span>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      password: "",
    },
  });

  const inputClassName =
    "register-input w-full bg-surface-container-low border border-primary-container/20 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline-variant snappy-transition";

  const selectClassName =
    "register-input w-full bg-surface-container-low border border-primary-container/20 rounded-xl py-4 px-4 text-on-surface snappy-transition cursor-pointer hover:border-secondary/40 focus:border-primary-container";

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors).find((field) => field?.message);
    toast.error(firstError?.message || "Please fix the invalid fields.");
  };

  const onSubmit = async (data) => {
    // if (!termsAccepted) {
    //   toast.error("Please accept the Terms of Service and Privacy Policy.");
    //   return;
    // }
    if (!data.role) {
      toast.error("Please select a role");
      return;
    }

    if (!data.fullName) {
      toast.error("Please enter your full name");
      return;
    }

    if (!data.email) {
      toast.error("Please enter your email");
      return;
    }

    if (!data.password) {
      toast.error("Please enter your password");
      return;
    }


    const imageFile = data.image[0];
        const imageUrl = await uploadImage(imageFile)
        // console.log(imageUrl);

    try {
      const result = await signUp.email({
        email: data.email.trim(),
        password: data.password,
        name: data.fullName.trim(),
        role: data.role,
        image: imageUrl || undefined,
      });


      if (result.error) {
        toast.error(result.error.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully! Welcome to VIGOR.");
      setTimeout(() => router.push("/"), 1500);
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Google sign in is not available.");
    }
  };

  return (
    <section className="lg:col-span-7 auth-form-panel p-10 lg:p-20 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <header className="mb-10">
          <h2 className="font-anybody text-headline-lg text-white mb-2">
            Create account
          </h2>
          <p className="font-hanken text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-secondary hover:text-primary snappy-transition hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block font-geist-label text-label-bold text-on-surface"
            >
              Full Name
            </label>
            <div className="relative">
              <FieldIcon icon={Person} focused={focusedField === "fullName"} />
              <Input
                id="fullName"
                type="text"
                placeholder="Alex Johnson"
                className={inputClassName}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must not exceed 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s'-]+$/,
                    message:
                      "Name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                  validate: (value) =>
                    value.trim().length >= 2 || "Name must be at least 2 characters",
                  onBlur: () => setFocusedField(null),
                })}
                onFocus={() => setFocusedField("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-error text-sm font-hanken text-body-md">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-geist-label text-label-bold text-on-surface"
            >
              Email address
            </label>
            <div className="relative">
              <FieldIcon icon={Envelope} focused={focusedField === "email"} />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={inputClassName}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                  onBlur: () => setFocusedField(null),
                })}
                onFocus={() => setFocusedField("email")}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm font-hanken text-body-md">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label
              htmlFor="role"
              className="font-geist-label text-label-bold text-on-surface"
            >
              Select Role
            </Label>
            <select
              id="role"
              className={selectClassName}
              {...register("role", {
                required: "Please select a role",
                validate: (value) =>
                  VALID_ROLES.includes(value) ||
                  "Please select a valid role (User or Trainer)",
              })}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
            {errors.role && (
              <p className="text-error text-sm font-hanken text-body-md">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-geist-label text-label-bold text-on-surface">
              Profile Image{" "}
              <span className="text-outline-variant font-normal">(optional)</span>
            </label>
            <div className="group relative cursor-pointer">
              <input
                {...register("image", {
                  required: "Profile image is required",
                })}
                id="image"
                name="image"                
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              />
              <div className="w-full border-2 border-dashed border-primary-container/30 rounded-xl py-6 flex flex-col items-center justify-center gap-2 group-hover:border-secondary/50 snappy-transition">
                <Icon
                  icon={Picture}
                  className="text-outline group-hover:text-secondary snappy-transition"
                  size={24}
                />
                <p className="font-hanken text-body-md text-on-surface-variant">
                  {profileImage ? profileImage.name : "Click to upload an image"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-geist-label text-label-bold text-on-surface"
            >
              Password
            </label>
            <div className="relative">
              <FieldIcon icon={Lock} focused={focusedField === "password"} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClassName} pr-12`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
                    message:
                      "Password must include uppercase, lowercase, number, and special character (@$!%*?&#)",
                  },
                  onBlur: () => setFocusedField(null),
                })}
                onFocus={() => setFocusedField("password")}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary snappy-transition"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showPassword ? EyeSlash : Eye} size={20} />
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm font-hanken text-body-md">
                {errors.password.message}
              </p>
            )}
          </div>

          {/*           */}

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full py-4 px-6 h-auto bg-primary-container hover:bg-primary-container/90 text-on-primary-container rounded-xl font-geist-label text-[16px] uppercase tracking-widest flex items-center justify-center gap-2 auth-glow snappy-transition hover:scale-[1.02] active:scale-95 group shadow-lg shadow-primary-container/30"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
            <Icon
              icon={ArrowRight}
              className="group-hover:translate-x-1 snappy-transition"
              size={20}
            />
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-container/20" />
          </div>
          <div className="relative flex justify-center text-label-sm font-geist-label uppercase tracking-widest">
            <span className="bg-[#15121b] px-4 text-on-surface-variant">OR</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onPress={handleGoogleSignIn}
          className="w-full bg-surface-container-low hover:bg-primary-container/10 border border-primary-container/25 text-on-surface font-geist-label text-label-bold py-4 h-auto rounded-xl flex items-center justify-center gap-3 snappy-transition hover:border-secondary/40"
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>
    </section>
  );
}
