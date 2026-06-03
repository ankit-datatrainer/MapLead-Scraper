"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, BookOpen, Clock } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to an API route / email service
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingNav />

      <main className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-16 w-full flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-mono text-label-mono uppercase tracking-wider text-primary mb-3">Support</span>
          <h1 className="font-display-lg text-headline-lg font-bold text-on-surface mb-3">Contact Support</h1>
          <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
            Have a question or running into an issue? We&apos;re here to help. Typical response time is under 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact options */}
          <div className="flex flex-col gap-4">
            <ContactCard
              icon={<Mail size={20} />}
              title="Email Support"
              description="For account, billing, or general questions."
              action={<a href="mailto:support@maplead.app" className="text-primary text-body-sm font-semibold hover:underline">support@maplead.app</a>}
            />
            <ContactCard
              icon={<BookOpen size={20} />}
              title="Documentation"
              description="Find answers in our step-by-step guides."
              action={<Link href="/docs" className="text-primary text-body-sm font-semibold hover:underline">Browse docs →</Link>}
            />
            <ContactCard
              icon={<Clock size={20} />}
              title="Response Time"
              description="We aim to respond to all inquiries within 24 hours on business days."
              action={null}
            />
            <ContactCard
              icon={<MessageSquare size={20} />}
              title="Feature Requests"
              description="Have an idea? We'd love to hear it."
              action={<a href="mailto:feedback@maplead.app" className="text-primary text-body-sm font-semibold hover:underline">feedback@maplead.app</a>}
            />
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-surface-primary rounded-xl border border-border-subtle shadow-ambient p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2">Message sent!</h2>
                <p className="text-body-md text-on-surface-variant max-w-sm">
                  Thanks for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-primary text-body-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-headline-md text-xl font-semibold text-on-surface mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        placeholder="Jane Doe"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g. Scrape not returning results"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="Describe your issue or question in detail..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full bg-surface-primary border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Mail size={18} /> Send message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="bg-surface-primary rounded-xl border border-border-subtle p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold text-on-surface text-body-md">{title}</h3>
      </div>
      <p className="text-body-sm text-on-surface-variant mb-2">{description}</p>
      {action}
    </div>
  );
}
