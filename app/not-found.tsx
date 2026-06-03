import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-bg p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-surface-container-low dark:bg-inverse-surface flex items-center justify-center text-primary mx-auto mb-6">
          <MapPin size={32} />
        </div>
        <h1 className="font-display-lg text-headline-lg font-bold text-on-background dark:text-inverse-on-surface mb-2">
          404 — Page Not Found
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary rounded-lg py-2.5 px-6 font-semibold hover:bg-on-primary-fixed-variant transition-colors shadow-sm shadow-primary/10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
