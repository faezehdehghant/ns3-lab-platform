"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";

interface Step {
  title: string;
  description: string;
  code?: string;
}

interface StepWalkthroughProps {
  steps: Step[];
  title?: string;
}

export default function StepWalkthrough({ steps, title }: StepWalkthroughProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
    setCompletedSteps((prev) => new Set(prev).add(index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-6"
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-foreground/70">
          {completedSteps.size}/{steps.length}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const isExpanded = expandedStep === i;
          const isCompleted = completedSteps.has(i);

          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04]"
            >
              <button
                onClick={() => toggleStep(i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/50"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCompleted
                      ? "bg-accent/10 text-accent"
                      : "bg-surface text-foreground/70"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                </span>
                <span className="flex-1 text-[15px] font-semibold text-foreground">
                  {step.title}
                </span>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-foreground/70" />
                ) : (
                  <ChevronRight size={16} className="text-foreground/70" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-card-border/40 px-4 py-3">
                      <p className="text-[15px] text-foreground/80 leading-relaxed">
                        {step.description}
                      </p>
                      {step.code && (
                        <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 text-sm text-foreground font-mono ring-1 ring-black/[0.04]">
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
