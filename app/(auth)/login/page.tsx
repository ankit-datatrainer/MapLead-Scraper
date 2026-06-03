"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { success, error: errorToast } = useToast();
  const signIn = useAppStore((s) => s.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const user = signIn({ email: values.email, password: values.password });
      success("Signed in", `Welcome back, ${user.fullName.split(" ")[0]}!`);
      router.push("/dashboard/profile");
    } catch (e) {
      errorToast(
        "Sign in failed",
        e instanceof Error ? e.message : "Please try again.",
      );
    }
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface">
        Welcome back
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
        Sign in to continue extracting leads.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
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
            placeholder="••••••••"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-error text-body-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-body-sm">
          <label className="inline-flex items-center gap-2 text-on-surface-variant cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-outline text-primary focus:ring-primary"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          size="lg"
        >
          Sign in
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
