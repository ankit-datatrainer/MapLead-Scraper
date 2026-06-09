"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  User,
  KeyRound,
  Sliders,
  Bell,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Building2,
  Mail,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { testApifyConnection } from "@/lib/apify";
import { maskApiKey } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Settings, Theme, ExportFormat } from "@/types/settings";

type TabKey = "account" | "api-key" | "preferences" | "notifications" | "privacy";

function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get("tab") as TabKey) || "account";
  const [tab, setTab] = useState<TabKey>(defaultTab);

  useEffect(() => {
    const t = searchParams.get("tab") as TabKey;
    if (t) {
      setTab(t);
    }
  }, [searchParams]);

  return (
    <div className="p-margin-mobile lg:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface">
          Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Manage your account, API access, and preferences.
        </p>
      </motion.div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TabsList className="mb-8">
          <TabsTrigger value="account" icon={<User size={16} />}>
            Account
          </TabsTrigger>
          <TabsTrigger value="api-key" icon={<KeyRound size={16} />}>
            API Key
          </TabsTrigger>
          <TabsTrigger value="preferences" icon={<Sliders size={16} />}>
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={<Bell size={16} />}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" icon={<ShieldCheck size={16} />}>
            Privacy
          </TabsTrigger>
        </TabsList>
        </motion.div>

        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="api-key">
          <ApiKeyTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-on-surface-variant">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function SectionCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient mb-6"
    >
      <header className="p-6 border-b border-border-subtle dark:border-outline-variant">
        <h2 className="font-headline-md text-[18px] font-semibold text-on-surface dark:text-inverse-on-surface">
          {title}
        </h2>
        {description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {description}
          </p>
        )}
      </header>
      <div className="p-6">{children}</div>
      {footer && (
        <footer className="px-6 py-4 border-t border-border-subtle dark:border-outline-variant flex items-center justify-end gap-3 bg-surface-secondary/40 dark:bg-dark-bg/30 rounded-b-xl">
          {footer}
        </footer>
      )}
    </motion.section>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border-subtle dark:border-outline-variant last:border-b-0">
      <div className="min-w-0 max-w-md">
        <p className="font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
          {label}
        </p>
        {description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 self-center">{children}</div>
    </div>
  );
}

/* ---------------------------- Account ----------------------------- */

function AccountTab() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { success } = useToast();

  const [form, setForm] = useState<Settings["account"]>(settings.account);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setField = <K extends keyof Settings["account"]>(
    key: K,
    value: Settings["account"][K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateSettings({ account: form });
    setSaving(false);
    success("Profile saved", "Your account details have been updated.");
  }

  return (
    <form onSubmit={onSave}>
      <SectionCard
        title="Profile"
        description="This information appears on receipts and team invites."
        footer={
          <Button type="submit" loading={saving}>
            <Save size={16} /> Save changes
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              icon={<User size={18} />}
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              icon={<Building2 size={18} />}
              value={form.company ?? ""}
              onChange={(e) => setField("company", e.target.value)}
              placeholder="Acme Co."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Danger zone"
        description="Permanently delete your account and all associated scrape data."
      >
        <Row
          label="Delete account"
          description="This action is irreversible. All saved searches and scrape results will be removed."
        >
          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={16} /> Delete account
          </Button>
        </Row>
      </SectionCard>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete account?"
        description="This action cannot be undone. All scrape results, saved searches, and account data will be removed."
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                success("Account deletion queued", "Demo only.");
              }}
            >
              <Trash2 size={16} /> Yes, delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 p-4 rounded-lg bg-error-container/40 border border-error/30">
          <AlertTriangle className="text-error mt-0.5 shrink-0" size={20} />
          <p className="text-body-sm text-on-surface dark:text-inverse-on-surface">
            Type <span className="font-mono font-semibold">DELETE</span> in the
            input below if you really want to proceed (this demo just closes the
            dialog).
          </p>
        </div>
      </Dialog>
    </form>
  );
}

/* ---------------------------- API Key ----------------------------- */

function ApiKeyTab() {
  const settings = useAppStore((s) => s.settings);
  const setApiKey = useAppStore((s) => s.setApiKey);
  const { success, error: errorToast } = useToast();

  const [draft, setDraft] = useState(settings.apifyApiKey);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function onTest() {
    setTesting(true);
    setTestResult(null);
    const res = await testApifyConnection(draft);
    setTesting(false);
    setTestResult(res);
    if (res.ok) success("Connection OK", res.message);
    else errorToast("Connection failed", res.message);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setApiKey(draft.trim());
    setSaving(false);
    success("API key saved", "Stored locally in your browser.");
  }

  return (
    <form onSubmit={onSave}>
      <SectionCard
        title="Apify API token"
        description="Bring your own Apify token. We never send it to our servers — it's stored only on this device."
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={onTest}
              loading={testing}
              disabled={!draft || draft.length < 8}
            >
              {testing ? null : <CheckCircle2 size={16} />}
              Test connection
            </Button>
            <Button type="submit" loading={saving}>
              <Save size={16} /> Save key
            </Button>
          </>
        }
      >
        <div>
          <Label htmlFor="apify-key">Apify API token</Label>
          <Input
            id="apify-key"
            type={show ? "text" : "password"}
            icon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                aria-label={show ? "Hide token" : "Show token"}
                onClick={() => setShow((s) => !s)}
                className="hover:text-primary transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            placeholder="apify_api_xxxxxxxxxxxx"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-4">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Find your token in{" "}
              <a
                href="https://console.apify.com/account/integrations"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Apify Console → Settings → Integrations
              </a>
              .
            </p>
            {settings.apifyApiKey && (
              <span className="font-mono text-label-mono text-on-surface-variant whitespace-nowrap">
                Saved: {maskApiKey(settings.apifyApiKey)}
              </span>
            )}
          </div>

          {testResult && (
            <div
              className={cn(
                "mt-4 p-3 rounded-lg flex items-start gap-2 text-body-sm border",
                testResult.ok
                  ? "bg-secondary-container text-on-secondary-container border-secondary/30"
                  : "bg-error-container text-on-error-container border-error/30",
              )}
            >
              {testResult.ok ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="How it's used"
        description="Best practices for handling your API key."
      >
        <ul className="space-y-3 text-body-sm text-on-surface-variant">
          <li className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="text-secondary mt-1 shrink-0"
              aria-hidden
            />
            <span>
              Stored in <code className="font-mono">localStorage</code> on this
              device only — never transmitted to MapLead servers.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="text-secondary mt-1 shrink-0"
              aria-hidden
            />
            <span>
              Used to authenticate calls to Apify when you start a scrape.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="text-secondary mt-1 shrink-0"
              aria-hidden
            />
            <span>
              Rotate or revoke anytime from Apify Console — old tokens stop
              working immediately.
            </span>
          </li>
        </ul>
      </SectionCard>
    </form>
  );
}

/* -------------------------- Preferences --------------------------- */

function PreferencesTab() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { success } = useToast();

  const [theme, setTheme] = useState<Theme>(settings.theme);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    settings.exportFormat,
  );
  const [defaultRadius, setDefaultRadius] = useState(settings.defaultRadius);
  const [defaultLimit, setDefaultLimit] = useState(settings.defaultResultLimit);
  const [saving, setSaving] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateSettings({
      theme,
      exportFormat,
      defaultRadius,
      defaultResultLimit: defaultLimit,
    });
    setSaving(false);
    success("Preferences saved");
  }

  return (
    <form onSubmit={onSave}>


      <SectionCard
        title="Scraping defaults"
        description="Used when starting a new scrape."
      >
        <Row
          label="Default search radius"
          description="Pre-fills the radius slider on a new scrape (in miles)."
        >
          <Input
            type="number"
            min={1}
            max={50}
            className="w-32"
            value={defaultRadius}
            onChange={(e) => setDefaultRadius(Number(e.target.value) || 0)}
          />
        </Row>
        <Row
          label="Default result limit"
          description="Cap on results per scrape to control Apify spend."
        >
          <Input
            type="number"
            min={1}
            max={50000}
            className="w-32"
            value={defaultLimit}
            onChange={(e) => setDefaultLimit(Number(e.target.value) || 0)}
          />
        </Row>
      </SectionCard>

      <SectionCard
        title="Exports"
        description="Choose your preferred output format for downloads."
        footer={
          <Button type="submit" loading={saving}>
            <Save size={16} /> Save preferences
          </Button>
        }
      >
        <Row
          label="Default export format"
          description="The format used by the download buttons."
        >
          <Select
            value={exportFormat}
            onChange={(e) =>
              setExportFormat(e.target.value as ExportFormat)
            }
            className="w-44"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </Select>
        </Row>
      </SectionCard>
    </form>
  );
}

/* -------------------------- Notifications ------------------------- */

function NotificationsTab() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { success } = useToast();

  const [draft, setDraft] = useState(settings.notifications);
  const [saving, setSaving] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateSettings({ notifications: draft });
    setSaving(false);
    success("Notifications updated");
  }

  return (
    <form onSubmit={onSave}>
      <SectionCard
        title="Email notifications"
        description="Decide what we send to your inbox."
        footer={
          <Button type="submit" loading={saving}>
            <Save size={16} /> Save
          </Button>
        }
      >
        <Row
          label="Scrape completed"
          description="Send an email each time a scrape finishes successfully."
        >
          <Switch
            checked={draft.onCompletion}
            onCheckedChange={(v) => setDraft({ ...draft, onCompletion: v })}
            aria-label="Notify on completion"
          />
        </Row>
        <Row
          label="Scrape failed"
          description="Send an email if a scrape fails or hits a rate limit."
        >
          <Switch
            checked={draft.onFailure}
            onCheckedChange={(v) => setDraft({ ...draft, onFailure: v })}
            aria-label="Notify on failure"
          />
        </Row>
        <Row
          label="Product updates"
          description="Receive monthly updates about new features and improvements."
        >
          <Switch
            checked={draft.productUpdates}
            onCheckedChange={(v) =>
              setDraft({ ...draft, productUpdates: v })
            }
            aria-label="Product updates"
          />
        </Row>
      </SectionCard>
    </form>
  );
}

/* ----------------------------- Privacy ---------------------------- */

function PrivacyTab() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { success, info } = useToast();

  const [draft, setDraft] = useState(settings.privacy);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateSettings({ privacy: draft });
    setSaving(false);
    success("Privacy settings saved");
  }

  async function clearLocalData() {
    setClearing(true);
    try {
      window.localStorage.clear();
      info("Local data cleared", "Reloading…");
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setClearing(false);
    }
  }

  return (
    <form onSubmit={onSave}>
      <SectionCard
        title="Data handling"
        description="Control how MapLead handles data on this device."
        footer={
          <Button type="submit" loading={saving}>
            <Save size={16} /> Save
          </Button>
        }
      >
        <Row
          label="Store API key locally"
          description="Persist the Apify token in your browser between sessions."
        >
          <Switch
            checked={draft.storeKeyLocally}
            onCheckedChange={(v) =>
              setDraft({ ...draft, storeKeyLocally: v })
            }
            aria-label="Store key locally"
          />
        </Row>
        <Row
          label="Anonymous usage analytics"
          description="Help us improve MapLead by sharing anonymous, aggregated stats. Never includes scrape contents."
        >
          <Switch
            checked={draft.shareUsageAnalytics}
            onCheckedChange={(v) =>
              setDraft({ ...draft, shareUsageAnalytics: v })
            }
            aria-label="Share analytics"
          />
        </Row>
      </SectionCard>

      <SectionCard
        title="Local storage"
        description="MapLead stores settings, jobs, and saved searches in your browser."
      >
        <Row
          label="Clear all local data"
          description="Removes settings, saved searches, and any cached scrape results from this device."
        >
          <Button
            type="button"
            variant="secondary"
            onClick={clearLocalData}
            loading={clearing}
          >
            {clearing ? <Loader2 size={16} /> : <Trash2 size={16} />}
            Clear data
          </Button>
        </Row>
        <Row label="Status">
          <Badge tone="info">Stored on this device only</Badge>
        </Row>
      </SectionCard>
    </form>
  );
}
