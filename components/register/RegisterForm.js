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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("attendee");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [roleError, setRoleError] = useState("");

  const inputClassName =
    "register-input w-full bg-surface-container-low border border-primary-container/20 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline-variant snappy-transition";

  const selectClassName =
    "register-input w-full bg-surface-container-low border border-primary-container/20 rounded-xl py-4 px-4 text-on-surface snappy-transition cursor-pointer hover:border-secondary/40 focus:border-primary-container";

  // const handleSubmitForm = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setRoleError("");

  //   if (!role) {
  //     setRoleError("Role is required");
  //     return;
  //   }

  //   if (!termsAccepted) {
  //     setError("Please accept the Terms of Service and Privacy Policy.");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const result = await signUp.email({
  //       email,
  //       password,
  //       name: fullName,
  //       role,
  //       image: profileImage ? URL.createObjectURL(profileImage) : undefined,
  //     });

  //     if (result.error) {
  //       setError(result.error.message || "Registration failed. Please try again.");
  //       return;
  //     }

  //     router.push("/");
  //   } catch {
  //     setError("Registration failed. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      setError("Google sign in is not available.");
    }
  };

  const {register, handleSubmit , formState: {errors}} = useForm();
  console.log(errors);

  const onSubmit = (data) => console.log(data) 

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("fullName", {required: "Full Name is required"})}

                id="fullName"
                type="text"
                placeholder="Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                required
                className={inputClassName}
              />
            </div>
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
                {...register("email", {required: "Email is required"})}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label
              htmlFor="role"
              className="font-geist-label text-label-bold text-on-surface"
            >
              Select Role
            </Label>
            <select
              {...register("role", {required: "Role is required"})}
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setRoleError("");
              }}
              className={selectClassName}
              required
            >
              <option  value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
            {roleError && (
              <p className="text-error text-sm font-hanken text-body-md">{roleError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-geist-label text-label-bold text-on-surface">
              Profile Image{" "}
              <span className="text-outline-variant font-normal">(optional)</span>
            </label>
            <div className="group relative cursor-pointer">
              <input
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                className={`${inputClassName} pr-12`}
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
          </div>

          <Checkbox
            isSelected={termsAccepted}
            onChange={setTermsAccepted}
            className="flex items-start gap-3 py-2"
          >
            <span className="font-geist-label text-label-sm text-on-surface-variant leading-relaxed">
              By creating an account you agree to our{" "}
              <Link
                href="#"
                className="text-on-surface hover:text-secondary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-on-surface hover:text-secondary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </Checkbox>

          {error && (
            <p className="text-error text-sm font-hanken text-body-md">{error}</p>
          )}

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
