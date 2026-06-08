"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Eye,
  EyeOff,
  KeyRound,
  Info,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  Phone,
  Globe,
  Star,
  Radar,
  Gauge,
  Bookmark,
  Wand2,
} from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, ESTIMATED_COST_PER_RESULT } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { runMockScrape } from "@/lib/apify";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";

const STEPS = [
  { id: 1, label: "Target" },
  { id: 2, label: "Filters" },
  { id: 3, label: "Settings" },
  { id: 4, label: "Launch" },
] as const;

type Form = {
  keyword: string;
  location: string;
  category: string;
  radius: number;
  hasPhone: boolean;
  hasWebsite: boolean;
  minRating: number | null;
  minReviews: number | "";
  apifyApiKey: string;
  resultLimit: number;
  saveAsPreset: boolean;
  presetName: string;
};

export default function NewScrapePage() {
  const router = useRouter();
  const { success, error: errorToast, info } = useToast();
  const { settings, addJob, updateJob, addSavedSearch, setApiKey, updateSettings } = useAppStore();
  const [step, setStep] = useState(1);
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapeCount, setScrapeCount] = useState(0);

  const [form, setForm] = useState<Form>({
    keyword: "",
    location: "San Francisco, CA",
    category: "all",
    radius: settings.defaultRadius,
    hasPhone: true,
    hasWebsite: false,
    minRating: 4,
    minReviews: 50,
    apifyApiKey: settings.apifyApiKey,
    resultLimit: settings.defaultResultLimit,
    saveAsPreset: false,
    presetName: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("maplead_draft_scrape");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.form) setForm((f) => ({ ...f, ...parsed.form }));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("maplead_draft_scrape", JSON.stringify({ step, form }));
    }
  }, [step, form, isLoaded]);

  const setField = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const estimatedCost = form.resultLimit * ESTIMATED_COST_PER_RESULT;

  const stepValid = useMemo(() => {
    if (step === 1) return form.keyword.trim().length >= 2 && form.location.trim().length >= 2;
    if (step === 3) return form.apifyApiKey.trim().length >= 8 && form.resultLimit > 0;
    return true;
  }, [step, form]);

  const next = () => {
    if (!stepValid) {
      errorToast("Please complete the required fields");
      return;
    }
    setStep((s) => Math.min(STEPS.length, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  async function launch() {
    setSubmitting(true);
    if (form.apifyApiKey && form.apifyApiKey.trim() !== "") {
      setApiKey(form.apifyApiKey.trim());
    }
    const jobId = uid("job");
    const jobName = `${form.keyword} in ${form.location}`;
    addJob({
      id: jobId,
      name: jobName,
      keyword: form.keyword,
      location: form.location,
      category: form.category,
      radius: form.radius,
      resultLimit: form.resultLimit,
      filters: {
        hasPhone: form.hasPhone,
        hasWebsite: form.hasWebsite,
        minRating: form.minRating ?? null,
        minReviews: form.minReviews === "" ? null : Number(form.minReviews),
      },
      status: "running",
      progress: 0,
      resultCount: 0,
      createdAt: new Date().toISOString(),
    });
    info("Scrape started", "We'll keep you posted on progress.");
    if (form.saveAsPreset && form.presetName.trim()) {
      addSavedSearch({
        name: form.presetName.trim(),
        keyword: form.keyword,
        location: form.location,
        category: form.category,
        radius: form.radius,
        resultLimit: form.resultLimit,
        filters: {
          hasPhone: form.hasPhone,
          hasWebsite: form.hasWebsite,
          minRating: form.minRating ?? null,
          minReviews: form.minReviews === "" ? null : Number(form.minReviews),
        },
        avgResults: 0,
      });
    }

    try {
      const leads = await runMockScrape(
        {
          keyword: form.keyword,
          location: form.location,
          category: form.category,
          radius: form.radius,
          resultLimit: form.resultLimit,
          filters: {
            hasPhone: form.hasPhone,
            hasWebsite: form.hasWebsite,
            minRating: form.minRating ?? null,
            minReviews: form.minReviews === "" ? null : Number(form.minReviews),
          },
          token: form.apifyApiKey,
        },
        (progress, partial) => {
          updateJob(jobId, { progress, resultCount: partial });
          setScrapeProgress(progress);
          setScrapeCount(partial);
        }
      );
      updateJob(jobId, {
        status: "completed",
        progress: 100,
        resultCount: leads.length,
        results: leads,
        completedAt: new Date().toISOString(),
      });
      updateSettings({
        apifyCreditsUsed: (settings.apifyCreditsUsed || 0) + (leads.length * ESTIMATED_COST_PER_RESULT)
      });
      success("Scrape complete", `${leads.length} leads extracted.`);
      localStorage.removeItem("maplead_draft_scrape");
      router.push(`/dashboard/results/${jobId}`);
    } catch (e) {
      updateJob(jobId, {
        status: "failed",
        error: e instanceof Error ? e.message : "Unknown error",
      });
      errorToast(
        "Scrape failed",
        e instanceof Error ? e.message : "Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background dark:text-inverse-on-surface mb-2">
            Create New Task
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Configure parameters to extract high-quality business leads.
          </p>
        </div>

        {/* Stepper */}
        <Stepper current={step} />

        {/* Form container */}
        <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient p-6 md:p-8 min-h-[500px] relative overflow-hidden">
          {step === 1 && (
            <StepTarget form={form} setField={setField} />
          )}
          {step === 2 && (
            <StepFilters form={form} setField={setField} />
          )}
          {step === 3 && (
            <StepSettings
              form={form}
              setField={setField}
              showKey={showKey}
              setShowKey={setShowKey}
              estimatedCost={estimatedCost}
            />
          )}
          {step === 4 && (
            <StepLaunch
              form={form}
              setField={setField}
              estimatedCost={estimatedCost}
              submitting={submitting}
              onLaunch={launch}
              progress={scrapeProgress}
              count={scrapeCount}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="secondary"
            onClick={back}
            className={step === 1 ? "opacity-0 pointer-events-none" : ""}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          {step < STEPS.length && (
            <Button onClick={next}>
              Next step <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Stepper -------------------- */
function Stepper({ current }: { current: number }) {
  const progress = ((current - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="mb-8 relative">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-border-subtle dark:bg-outline-variant z-0 rounded-full" />
      <div
        className="absolute top-4 left-0 h-0.5 bg-primary z-0 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {STEPS.map((s) => {
          const reached = s.id <= current;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 transition-colors",
                  "ring-background dark:ring-dark-bg",
                  reached
                    ? "bg-primary text-on-primary"
                    : "bg-surface-primary dark:bg-dark-surface border border-border-subtle dark:border-outline-variant text-on-surface-variant",
                )}
              >
                {s.id}
              </div>
              <span
                className={cn(
                  "font-mono text-label-mono",
                  reached
                    ? "text-primary font-bold"
                    : "text-on-surface-variant",
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- Step 1: Target -------------------- */
function StepTarget({
  form,
  setField,
}: {
  form: Form;
  setField: <K extends keyof Form>(k: K, v: Form[K]) => void;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-6">
        Target Parameters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div>
            <Label htmlFor="keyword">Search Query / Keywords</Label>
            <Input
              id="keyword"
              icon={<Search size={18} />}
              placeholder="e.g. Italian Restaurants, Plumbers"
              value={form.keyword}
              onChange={(e) => setField("keyword", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              icon={<MapPin size={18} />}
              placeholder="City, State, or Zip"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <Label className="mb-0">Search Radius</Label>
              <span className="font-body-sm text-body-sm text-primary font-medium">
                {form.radius} Miles
              </span>
            </div>
            <input
              className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              max={50}
              min={1}
              type="range"
              value={form.radius}
              onChange={(e) => setField("radius", Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] text-outline mt-1">
              <span>1 mi</span>
              <span>50 mi</span>
            </div>
          </div>
        </div>

        {/* Map preview */}
        <div className="flex flex-col">
          <Label>Extraction Area Preview</Label>
          <div className="flex-1 bg-surface-secondary dark:bg-inverse-surface/30 border border-border-subtle dark:border-outline-variant rounded-lg overflow-hidden relative min-h-[240px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#0058be_1px,transparent_1px)] [background-size:18px_18px]" />
            <div
              className="absolute inset-0 m-auto rounded-full border-2 border-primary/40 bg-primary/5 flex items-center justify-center transition-all duration-300"
              style={{
                width: `${20 + (form.radius / 50) * 80}%`,
                height: `${20 + (form.radius / 50) * 80}%`,
              }}
            >
              <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_0_4px_rgba(33,112,228,0.3)]" />
            </div>
            <div className="absolute bottom-3 left-3 bg-surface-primary/90 dark:bg-dark-surface/90 backdrop-blur px-3 py-1.5 rounded-md text-body-sm font-medium border border-border-subtle dark:border-outline-variant flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              {form.location || "Location"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Step 2: Filters -------------------- */
function StepFilters({
  form,
  setField,
}: {
  form: Form;
  setField: <K extends keyof Form>(k: K, v: Form[K]) => void;
}) {
  const ratingOptions: (number | null)[] = [null, 3, 4, 4.5];
  return (
    <div className="animate-fade-in">
      <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-2">
        Advanced Filters
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
        Refine your dataset to ensure high-quality leads.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <FilterToggle
          label="Must Have Phone Number"
          description="Exclude listings without contact info"
          icon={<Phone size={18} />}
          checked={form.hasPhone}
          onChange={(v) => setField("hasPhone", v)}
        />
        <FilterToggle
          label="Must Have Website"
          description="Exclude listings without URLs"
          icon={<Globe size={18} />}
          checked={form.hasWebsite}
          onChange={(v) => setField("hasWebsite", v)}
        />
        <div className="p-4 border border-border-subtle dark:border-outline-variant rounded-lg">
          <Label className="flex items-center gap-2">
            <Star size={14} className="text-tertiary-fixed-dim" /> Minimum Rating
          </Label>
          <div className="flex gap-2">
            {ratingOptions.map((v) => {
              const active = form.minRating === v;
              return (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setField("minRating", v)}
                  className={cn(
                    "flex-1 py-1.5 border rounded text-body-sm transition-colors",
                    active
                      ? "border-primary bg-primary-container/40 text-on-primary-container font-medium"
                      : "border-border-subtle dark:border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {v === null ? "Any" : `${v.toString()}+`}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 border border-border-subtle dark:border-outline-variant rounded-lg">
          <Label>Minimum Reviews</Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 10"
            value={form.minReviews}
            onChange={(e) =>
              setField(
                "minReviews",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function FilterToggle({
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-primary dark:bg-dark-surface hover:bg-surface dark:hover:bg-inverse-surface/40 transition-colors cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <div className="font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
            {label}
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            {description}
          </div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

/* -------------------- Step 3: Settings -------------------- */
function StepSettings({
  form,
  setField,
  showKey,
  setShowKey,
  estimatedCost,
}: {
  form: Form;
  setField: <K extends keyof Form>(k: K, v: Form[K]) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  estimatedCost: number;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-6">
        Extraction Settings
      </h2>
      <div className="max-w-xl">
        <div className="mb-6">
          <Label htmlFor="apify-key">Apify API Token</Label>
          <Input
            id="apify-key"
            type={showKey ? "text" : "password"}
            icon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                aria-label={showKey ? "Hide token" : "Show token"}
                onClick={() => setShowKey(!showKey)}
                className="hover:text-primary transition-colors"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            placeholder="apify_api_xxxxxxxxxxxx"
            value={form.apifyApiKey}
            onChange={(e) => setField("apifyApiKey", e.target.value)}
          />
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Your token is stored locally in your browser and only used for
            execution.
          </p>
        </div>

        <div className="mb-6 p-4 bg-surface-container-low dark:bg-inverse-surface/40 border border-primary-fixed dark:border-outline-variant rounded-lg flex items-start gap-3">
          <Info className="text-primary mt-0.5" size={20} />
          <div className="flex-1">
            <div className="font-body-md font-medium text-on-surface dark:text-inverse-on-surface mb-1">
              Max Results Limit
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Set a hard cap to control your compute costs.
            </p>
            <Input
              type="number"
              min={1}
              max={50000}
              className="w-32"
              value={form.resultLimit}
              onChange={(e) =>
                setField("resultLimit", Number(e.target.value) || 0)
              }
            />
            <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">
              Estimated Apify cost:{" "}
              <span className="font-semibold text-primary">
                {formatCurrency(estimatedCost)}
              </span>{" "}
              for up to {formatNumber(form.resultLimit)} results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Step 4: Launch -------------------- */
function StepLaunch({
  form,
  setField,
  estimatedCost,
  submitting,
  onLaunch,
  progress,
  count,
}: {
  form: Form;
  setField: <K extends keyof Form>(k: K, v: Form[K]) => void;
  estimatedCost: number;
  submitting: boolean;
  onLaunch: () => void;
  progress: number;
  count: number;
}) {
  if (submitting) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-12">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" className="stroke-surface-container-low dark:stroke-inverse-surface/30 fill-none" strokeWidth="12" />
            <motion.circle 
              cx="96" 
              cy="96" 
              r="88" 
              className="stroke-primary fill-none drop-shadow-md" 
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: `${(progress / 100) * 553} 1000` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span 
              className="font-display-lg text-headline-lg font-bold text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {Math.round(progress)}%
            </motion.span>
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-widest mt-1">
              Extracting
            </span>
          </div>
        </div>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface font-semibold">
            Found {formatNumber(count)} leads...
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md mx-auto">
            Please wait while we gather business details. Do not close this tab.
          </p>
        </motion.div>
      </div>
    );
  }

  const summary: { icon: React.ReactNode; label: string; tone?: "primary" | "neutral" }[] = [
    { icon: <Search size={14} />, label: form.keyword || "—" },
    { icon: <MapPin size={14} />, label: form.location || "—" },
    { icon: <Radar size={14} />, label: `${form.radius} Miles` },
    {
      icon: <Star size={14} />,
      label: form.minRating ? `${form.minRating}+ Rating` : "Any rating",
      tone: form.minRating ? "primary" : "neutral",
    },
    {
      icon: <Phone size={14} />,
      label: form.hasPhone ? "Has Phone" : "Phone optional",
      tone: form.hasPhone ? "primary" : "neutral",
    },
    {
      icon: <Globe size={14} />,
      label: form.hasWebsite ? "Has Website" : "Website optional",
      tone: form.hasWebsite ? "primary" : "neutral",
    },
    {
      icon: <Gauge size={14} />,
      label: `Max: ${formatNumber(form.resultLimit)}`,
    },
  ];

  return (
    <div className="animate-fade-in text-center py-4">
      <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={28} />
      </div>
      <h2 className="font-headline-lg text-headline-lg font-bold text-on-background dark:text-inverse-on-surface mb-2">
        Ready to Extract
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
        Review your parameters before launching the scraper task.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-2xl mx-auto">
        {summary.map((s, i) => (
          <Badge key={i} tone={s.tone === "primary" ? "primary" : "neutral"}>
            {s.icon}
            {s.label}
          </Badge>
        ))}
      </div>

      <div className="max-w-md mx-auto p-4 mb-8 rounded-lg border border-border-subtle dark:border-outline-variant bg-surface-container-low dark:bg-inverse-surface/40 text-left">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Estimated Apify spend{" "}
          <span className="font-semibold text-primary">
            {formatCurrency(estimatedCost)}
          </span>
          . Actual cost may vary based on returned dataset size.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 text-left">
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            className="rounded border-outline text-primary focus:ring-primary"
            checked={form.saveAsPreset}
            onChange={(e) => setField("saveAsPreset", e.target.checked)}
          />
          <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
            <Bookmark size={14} /> Save these settings as a preset
          </span>
        </label>
        {form.saveAsPreset && (
          <Input
            placeholder="Preset name (e.g. NY General Businesses)"
            value={form.presetName}
            onChange={(e) => setField("presetName", e.target.value)}
          />
        )}
      </div>

      <Button
        size="lg"
        variant="success"
        loading={submitting}
        onClick={onLaunch}
        className="px-12 py-4 font-headline-md text-headline-md"
      >
        <Play size={22} fill="currentColor" /> Start Scraping
      </Button>

      <p className="font-body-sm text-body-sm text-outline mt-4 flex items-center justify-center gap-1.5">
        <Wand2 size={14} /> You&apos;ll be redirected to results when complete.
      </p>
    </div>
  );
}
