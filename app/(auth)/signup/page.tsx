"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { success, error: errorToast } = useToast();
  const signUp = useAppStore((s) => s.signUp);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupInput) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register user");
      }

      // Also register in local state
      const user = signUp({
        id: data.user?.id,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      success(
        "Account created",
        `Welcome, ${user.fullName.split(" ")[0]} — let's get scraping!`,
      );
      router.push("/dashboard/profile");
    } catch (e) {
      errorToast(
        "Sign up failed",
        e instanceof Error ? e.message : "Please try again.",
      );
    }
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface">
        Create your account
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
        Start your first scrape in under two minutes.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            icon={<User size={18} />}
            placeholder="Jane Doe"
            autoComplete="name"
            invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-error text-body-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="you@company.com"
            autoComplete="email"
            invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-error text-body-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            placeholder="At least 8 characters"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-error text-body-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-body-sm text-on-surface-variant cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-outline text-primary focus:ring-primary"
            {...register("acceptTerms")}
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-error text-body-sm">
            {errors.acceptTerms.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          size="lg"
        >
          Create account
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
