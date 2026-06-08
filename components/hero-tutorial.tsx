"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, ClipboardPaste, Database, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: "step-1",
    title: "Get Apify Key",
    icon: <Key className="w-6 h-6 text-primary" />,
    description: "Copy your API key from Apify console.",
  },
  {
    id: "step-2",
    title: "Paste Key",
    icon: <ClipboardPaste className="w-6 h-6 text-secondary" />,
    description: "Enter it securely in MapLead.",
  },
  {
    id: "step-3",
    title: "Grab Leads",
    icon: <Database className="w-6 h-6 text-tertiary" />,
    description: "Extract accurate B2B leads instantly.",
  },
];

export function HeroTutorial() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mt-16 mx-auto relative group">
      {/* Decorative background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative rounded-2xl overflow-hidden border border-border-subtle dark:border-outline-variant shadow-2xl bg-surface-primary dark:bg-dark-surface/90 backdrop-blur-sm">
        {/* Fake window header */}
        <div className="h-12 bg-surface-secondary dark:bg-inverse-surface/50 border-b border-border-subtle dark:border-outline-variant flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-error" />
          <div className="w-3 h-3 rounded-full bg-[#f5b324]" />
          <div className="w-3 h-3 rounded-full bg-success" />
          <div className="ml-4 font-mono text-xs text-on-surface-variant/70">
            maplead-setup.sh
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[360px]">
          {/* Left panel: Steps */}
          <div className="md:w-1/3 border-r border-border-subtle dark:border-outline-variant p-6 bg-surface-container-low dark:bg-dark-surface flex flex-col justify-center gap-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              
              return (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-xl transition-all duration-500 flex items-start gap-4 ${
                    isActive
                      ? "bg-surface-primary dark:bg-inverse-surface/20 shadow-sm border border-primary/20"
                      : "opacity-60 grayscale"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-[15px] ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right panel: Animation Display */}
          <div className="md:w-2/3 p-8 md:p-12 bg-surface-primary dark:bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-sm"
                >
                  <div className="bg-[#111] border border-[#333] rounded-lg p-6 shadow-2xl">
                    <div className="text-sm text-gray-400 mb-4 font-mono">Apify Console</div>
                    <div className="space-y-4">
                      <div className="h-4 bg-[#222] rounded w-3/4"></div>
                      <div className="p-3 bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-between">
                        <span className="font-mono text-xs text-green-400">apify_api_••••••••••••••</span>
                        <motion.button
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ delay: 1, duration: 0.3 }}
                          className="px-3 py-1 bg-[#333] text-white text-xs rounded"
                        >
                          Copy
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-sm"
                >
                  <div className="bg-surface-primary dark:bg-dark-surface border border-primary/30 rounded-lg p-6 shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold text-sm">Settings</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Apify API Key
                      </label>
                      <div className="relative">
                        <div className="w-full h-10 border border-border-subtle rounded-md bg-surface-container-low flex items-center px-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 1, ease: "linear" }}
                            className="text-sm font-mono text-on-surface whitespace-nowrap overflow-hidden"
                          >
                            apify_api_X8H9...
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
                        >
                          <CheckCircle2 size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="bg-surface-primary dark:bg-dark-surface border border-border-subtle rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-container-low">
                      <div className="text-sm font-semibold">Lead Results</div>
                      <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Extracting...</div>
                    </div>
                    <div className="p-0">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.3 + 0.2 }}
                          className="flex items-center gap-4 p-4 border-b border-border-subtle last:border-0"
                        >
                          <div className="w-8 h-8 rounded bg-primary/20 flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-on-surface-variant/20 rounded w-1/3" />
                            <div className="h-2 bg-on-surface-variant/10 rounded w-1/2" />
                          </div>
                          <div className="w-16 h-4 bg-success/20 rounded" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ambient Background for animation area */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
