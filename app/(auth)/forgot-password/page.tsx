"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline mb-6"
      >
        <ArrowLeft size={16} /> Back to sign in
      </Link>
      <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface">
        Reset your password
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
        We&apos;ll email you a secure reset link.
      </p>

      {submitted ? (
        <div className="mt-8 p-5 rounded-xl border border-secondary/20 bg-secondary-container/30 flex items-start gap-3">
          <CheckCircle2 className="text-secondary mt-0.5" size={20} />
          <div>
            <p className="font-body-md font-semibold text-on-surface dark:text-inverse-on-surface">
              Check your inbox
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              If an account matches that email, you&apos;ll receive a link
              within a few minutes.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              icon={<Mail size={18} />}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" loading={loading} size="lg">
            Send reset link
          </Button>
        </form>
      )}
    </div>
  );
}
