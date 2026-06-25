"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Envelope, Lock, Eye, EyeSlash, ArrowRight } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import GoogleIcon from "./GoogleIcon";
import {
  signIn,
  signUp,
  authClient,
  getAuthUserFromResult,
  getAuthErrorMessage,
} from "@/lib/auth-client";
import { syncBackendToken, setAuthUser } from "@/lib/publicApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const LOGO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A";

const DEMO_ACCOUNTS = {
  Admin: { email: "admin@vigor.com", password: "Admin@123" },
  Trainer: { email: "trainer@vigor.com", password: "Trainer@123" },
  User: { email: "user@vigor.com", password: "User@123" },
};

function FieldIcon({ icon, focused }) {
  return (
    <span
      className={`absolute left-4 top-1/2 -translate-y-1/2 snappy-transition pointer-events-none ${
        focused ? "text-primary" : "text-outline"
      }`}
    >
      <Icon icon={icon} size={20} />
    </span>
  );
}

const DEMO_ROLE_MAP = {
  Admin: "admin",
  Trainer: "trainer",
  User: "user",
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [demoLoading, setDemoLoading] = useState(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const inputClassName =
    "login-input w-full bg-surface-container-low border border-primary-container/20 rounded-xl py-4 pl-12 text-on-surface placeholder:text-outline snappy-transition";

  const completeLogin = async (signedInUser) => {
    let user = signedInUser;

    if (!user) {
      try {
        const session = await authClient.getSession();
        user = session?.data?.user;
      } catch (error) {
        console.error("Session fetch after login failed:", error);
      }
    }

    if (!user) {
      toast.error(
        "Login succeeded but session was not saved. Clear cookies and try again."
      );
      return;
    }

    setAuthUser(user);
    try {
      await syncBackendToken(user);
    } catch (error) {
      console.error("Backend sync after login failed:", error);
    }

    toast.success("Sign in successfully! Welcome to VIGOR.");
    setTimeout(() => router.push("/"), 1500);
  };

  const signInDemoAccount = async (role) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return { error: { message: "Unknown demo role" } };

    let result = await signIn.email({
      email: account.email.trim(),
      password: account.password,
    });

    const invalidCredentials =
      result.error &&
      /invalid|not found|credentials|password|email/i.test(
        result.error.message || ""
      );

    if (invalidCredentials && role !== "Admin") {
      const signUpResult = await signUp.email({
        email: account.email.trim(),
        password: account.password,
        name: `Demo ${role}`,
        role: DEMO_ROLE_MAP[role] || "user",
      });

      if (!signUpResult.error) {
        result = await signIn.email({
          email: account.email.trim(),
          password: account.password,
        });
      }
    }

    return result;
  };

  const handleDemoLogin = async (role) => {
    if (demoLoading) return;

    setDemoLoading(role);
    try {
      const result = await signInDemoAccount(role);

      if (result.error) {
        toast.error(
          getAuthErrorMessage(
            result.error,
            role === "Admin"
              ? "Demo admin account not found. Register admin@vigor.com first."
              : "Demo sign in failed. Please try again."
          )
        );
        return;
      }

      await completeLogin(getAuthUserFromResult(result));
    } catch (error) {
      console.error("Demo login error:", error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setDemoLoading(null);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsSubmitting(true);

  //   try {
  //     const result = await signIn.email({ email, password });

  //     if (result.error) {
  //       setError(result.error.message || "Sign in failed. Please try again.");
  //       return;
  //     }

  //     router.push("/");
  //   } catch {
  //     setError("Sign in failed. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data) => {
    // if (!termsAccepted) {
    //   toast.error("Please accept the Terms of Service and Privacy Policy.");
    //   return;
    // }
    // if (!data.role) {
    //   toast.error("Please select a role");
    //   return;
    // }

    // if (!data.fullName) {
    //   toast.error("Please enter your full name");
    //   return;
    // }

    if (!data.email) {
      toast.error("Please enter your email");
      return;
    }

    if (!data.password) {
      toast.error("Please enter your password");
      return;
    }




    try {
      const result = await signIn.email({
        email: data.email.trim(),
        password: data.password
      });


      if (result.error) {
        toast.error(getAuthErrorMessage(result.error));
        return;
      }

      await completeLogin(getAuthUserFromResult(result));
    } catch (error) {
      console.error("Login error:", error);
      toast.error(getAuthErrorMessage(error));
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
    <div className="flex flex-col justify-center px-6 py-12 md:px-16 auth-form-panel relative">
      <div className="md:hidden flex items-center gap-2 mb-10">
        <Image src={LOGO_IMAGE} alt="VIGOR" width={32} height={32} className="h-8 w-auto" />
        <Link
          href="/"
          className="font-anybody text-xl font-extrabold text-primary italic"
        >
          VIGOR
        </Link>
      </div>

      <div className="mb-10">
        <h2 className="font-anybody text-display-lg font-bold mb-2">Welcome back</h2>
        <p className="font-hanken text-body-md text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-secondary font-semibold hover:text-primary hover:underline decoration-secondary/50 transition-all"
          >
            Sign up free
          </Link>
        </p>
      </div>

      <div className="mb-8">
        <span className="font-geist-label text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-3 block">
          Quick Demo Login
        </span>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(DEMO_ACCOUNTS).map((role) => (
            <Button
              key={role}
              type="button"
              variant="secondary"
              isDisabled={Boolean(demoLoading)}
              onPress={() => handleDemoLogin(role)}
              className="px-4 py-2 h-auto bg-surface-container rounded-lg font-geist-label text-label-bold text-on-surface-variant border border-primary-container/20 hover:bg-primary-container/15 hover:text-primary hover:border-secondary/40"
            >
              {demoLoading === role ? "Signing in..." : role}
            </Button>
          ))}
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="relative group">
            <FieldIcon icon={Envelope} focused={focusedField === "email"} />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`${inputClassName} pr-4`}
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="font-geist-label text-label-bold text-on-surface"
            >
              Password
            </label>
            <Link
              href="#"
              className="font-geist-label text-label-sm text-secondary/80 hover:text-secondary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <FieldIcon icon={Lock} focused={focusedField === "password"} />
            <input
              {...register("password", {
                required: "Password is required",
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`${inputClassName} pr-12`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon icon={showPassword ? EyeSlash : Eye} size={20} />
            </button>
          </div>
        </div>

        {errors.password && (
          <p className="text-error text-sm font-hanken text-body-md">
            {errors.password.message}
          </p>
        )}

        <Button
          type="submit"
          isDisabled={isSubmitting}
          className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-geist-label text-label-bold py-4 h-auto rounded-xl flex items-center justify-center gap-2 snappy-transition group shadow-lg shadow-primary-container/30 auth-glow"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
          <Icon
            icon={ArrowRight}
            className="group-hover:translate-x-1 transition-transform"
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
  );
}
