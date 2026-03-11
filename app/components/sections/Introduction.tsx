"use client";
import { motion } from "framer-motion";
import { FlaskConical, Wifi, BarChart3, Target } from "lucide-react";

const experiments = [
  {
    id: "E1",
    title: "Single BSS Throughput",
    description:
      "Measure throughput of a single BSS with varying number of stations and data rates using IEEE 802.11a.",
    icon: BarChart3,
  },
  {
    id: "E2",
    title: "OBSS & Hidden Node",
    description:
      "Analyze the impact of overlapping BSSs and hidden node problems on network performance.",
    icon: Wifi,
  },
];

const goals = [
  "Understand NS-3 simulator architecture and workflow",
  "Learn IEEE 802.11 DCF (CSMA/CA) mechanism",
  "Build and run NS-3 simulation scripts in C++",
  "Analyze wireless network performance metrics",
];

export default function Introduction() {
  return (
    <section id="introduction" className="scroll-mt-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 rounded-2xl bg-gradient-to-br from-[#0071e3]/10 via-white to-[#5856d6]/10 border border-card-border/40 p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-accent/10 p-3">
            <FlaskConical className="text-accent" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Lab 1: NS-3 Simulator
            </h2>
            <p className="text-base text-foreground/70">
              EE597 — Wireless Networks, USC Spring 2026
            </p>
          </div>
        </div>
        <p className="text-foreground leading-relaxed max-w-2xl">
          Welcome to the NS-3 Lab! In this lab, you will learn to use the NS-3
          network simulator to model and analyze IEEE 802.11 wireless networks.
          You&apos;ll write C++ simulation scripts, run experiments, and collect
          performance data.
        </p>
      </motion.div>

      {/* Learning Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Learning Goals
        </h3>
        <div className="grid gap-2">
          {goals.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="text-[15px] text-foreground">{goal}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experiments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <FlaskConical size={20} className="text-accent" />
          Lab Experiments
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {experiments.map((exp) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5 transition-colors hover:border-accent/40"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-accent/[0.06] p-2">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                    {exp.id}
                  </span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">{exp.title}</h4>
                <p className="text-[15px] text-foreground/80 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
