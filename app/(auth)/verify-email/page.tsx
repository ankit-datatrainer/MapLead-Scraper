"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-6">
        <MailCheck size={28} />
      </div>
      <h1 className="font-headline-md text-headline-md font-bold text-on-background dark:text-inverse-on-surface mb-2">
        Check your email
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-sm mx-auto">
        We&apos;ve sent a verification link to your email address. Click the
        link to activate your account.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="primary" disabled aria-label="Resend verification email">
          Resend Email
        </Button>
        <Link
          href="/login"
          className="font-body-sm text-body-sm text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
