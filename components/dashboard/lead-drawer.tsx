"use client";

import {
  X,
  Bookmark,
  Phone,
  Globe,
  MapPin,
  Star,
  Clock,
  Mail,
  Edit3,
} from "lucide-react";
import type { Lead } from "@/types/lead";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatNumber } from "@/lib/formatters";
import { useState, useEffect } from "react";

export function LeadDrawer({
  lead,
  onClose,
  onExportContact,
  onSaveNote,
}: {
  lead?: Lead | null;
  onClose: () => void;
  onExportContact?: (lead: Lead) => void;
  onSaveNote?: (lead: Lead, notes: string) => void;
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(lead?.notes ?? "");
  }, [lead]);

  if (!lead) {
    return <Drawer open={false} onClose={onClose}><div /></Drawer>;
  }

  return (
    <Drawer open={!!lead} onClose={onClose} ariaLabel="Lead details">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          type="button"
          aria-label="Save lead"
          className="w-8 h-8 rounded-full bg-surface-primary/90 dark:bg-dark-surface/90 backdrop-blur border border-border-subtle dark:border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container shadow-sm transition-colors"
        >
          <Bookmark size={16} />
        </button>
        <button
          type="button"
          aria-label="Close drawer"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-surface-primary/90 dark:bg-dark-surface/90 backdrop-blur border border-border-subtle dark:border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container shadow-sm transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="h-[200px] w-full bg-gradient-to-br from-primary-container to-primary relative">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-primary dark:from-dark-surface to-transparent" />
        </div>
        <div className="p-6 -mt-10 relative z-10">
          <div className="bg-surface-primary dark:bg-dark-surface rounded-lg p-5 shadow-ambient border border-border-subtle dark:border-outline-variant">
            <div className="flex justify-between items-start mb-2 gap-3">
              <h2 className="font-headline-md text-[22px] font-bold text-on-surface dark:text-inverse-on-surface">
                {lead.name}
              </h2>
              <div className="flex flex-col items-end shrink-0">
                {lead.rating !== undefined && (
                  <div className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[14px] font-bold flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {lead.rating}
                  </div>
                )}
                {lead.reviews !== undefined && (
                  <span className="text-[11px] text-outline mt-1 font-medium">
                    {formatNumber(lead.reviews)} Reviews
                  </span>
                )}
              </div>
            </div>
            {lead.address && (
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 mt-2">
                <MapPin size={16} className="text-outline shrink-0" />
                {lead.address}
                {lead.city ? `, ${lead.city}` : ""}
                {lead.state ? `, ${lead.state}` : ""}
                {lead.postalCode ? ` ${lead.postalCode}` : ""}
              </p>
            )}
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <DetailField
              label="Phone"
              icon={<Phone size={14} />}
              value={lead.phone}
            />
            <DetailField
              label="Email"
              icon={<Mail size={14} />}
              value={lead.email}
            />
            <DetailField
              label="Website"
              icon={<Globe size={14} />}
              value={lead.website}
              isLink
            />
            <DetailField
              label="Category"
              value={lead.category}
            />
            <DetailField
              label="Hours"
              icon={<Clock size={14} />}
              value={(() => {
                if (lead.hours && lead.hours.startsWith("[")) {
                  try {
                    const parsed = JSON.parse(lead.hours);
                    return (
                      <div className="flex flex-col gap-1 mt-2">
                        {parsed.map((h: any, i: number) => (
                          <div key={i} className="flex justify-between text-[13px] border-b border-border-subtle/30 pb-1 last:border-0 last:pb-0">
                            <span className="text-outline font-medium">{h.day}</span>
                            <span className="text-on-surface dark:text-inverse-on-surface">{h.hours}</span>
                          </div>
                        ))}
                      </div>
                    );
                  } catch(e) {
                    return lead.hours;
                  }
                }
                return lead.hours;
              })()}
              full
            />
            {(lead.latitude || lead.longitude) && (
              <DetailField
                label="Coordinates"
                value={`${lead.latitude?.toFixed(4)}, ${lead.longitude?.toFixed(4)}`}
                full
                mono
              />
            )}
          </div>

          {/* Notes */}
          <div className="mt-8">
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface dark:text-inverse-on-surface mb-3 flex items-center gap-2">
              <Edit3 size={16} className="text-outline" /> Internal Notes
            </h3>
            <Textarea
              className="h-24"
              placeholder="Add custom notes about this lead..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              size="sm"
              variant="secondary"
              className="mt-2 ml-auto"
              onClick={() => onSaveNote?.(lead, note)}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border-subtle dark:border-outline-variant flex gap-3">
        <Button variant="outline" className="flex-1">
          Add to Campaign
        </Button>
        <Button
          className="flex-1 text-white"
          onClick={() => onExportContact?.(lead)}
        >
          Export Contact
        </Button>
      </div>
    </Drawer>
  );
}

function DetailField({
  label,
  icon,
  value,
  full,
  isLink,
  mono,
}: {
  label: string;
  icon?: React.ReactNode;
  value?: React.ReactNode;
  full?: boolean;
  isLink?: boolean;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div
      className={`p-4 rounded-lg bg-surface-secondary dark:bg-inverse-surface/30 border border-border-subtle dark:border-outline-variant ${full ? "col-span-2" : ""}`}
    >
      <span className="block text-[11px] font-mono text-outline uppercase mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {isLink ? (
        <a
          href={typeof value === "string" && value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="font-body-sm text-primary font-medium hover:underline truncate block"
        >
          {typeof value === "string" ? value.replace(/^https?:\/\//, "") : value}
        </a>
      ) : (
        <span
          className={`font-body-sm text-on-surface dark:text-inverse-on-surface font-medium ${mono ? "font-mono text-[13px]" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
