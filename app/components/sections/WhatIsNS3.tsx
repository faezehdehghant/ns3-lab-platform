"use client";
import { motion } from "framer-motion";
import {
  Server,
  Boxes,
  Code2,
  Clock,
  Globe,
  BookOpen,
  Layers,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "Discrete-Event Simulation",
    description:
      "Events are processed in chronological order. The simulator jumps from event to event — no wasted computation on idle time.",
  },
  {
    icon: Code2,
    title: "C++ & Python",
    description:
      "Core is written in C++ for performance. Python bindings are available for scripting. Simulation scripts are typically in C++.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description:
      "Protocol stacks are modular — swap WiFi for LTE, change routing protocols, or add new modules easily.",
  },
  {
    icon: Clock,
    title: "Realistic Models",
    description:
      "Includes detailed models for WiFi (802.11a/b/g/n/ac/ax), LTE, propagation loss, mobility patterns, and more.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Free and open-source (GPLv2). Large community with extensive documentation and active development.",
  },
  {
    icon: Zap,
    title: "Scalable",
    description:
      "Can simulate large networks with hundreds of nodes. Supports distributed simulation for even larger scenarios.",
  },
];

const architecture = [
  { layer: "Simulation Scripts", desc: "Your C++ scenario code", color: "#38bdf8" },
  { layer: "Helper API", desc: "Simplified topology setup", color: "#4ade80" },
  { layer: "Core Models", desc: "WiFi, Internet, Mobility", color: "#fbbf24" },
  { layer: "Simulation Core", desc: "Event scheduler, time mgmt", color: "#a78bfa" },
];

export default function WhatIsNS3() {
  return (
    <section id="what-is-ns3" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#5856d6]/15 p-3">
            <Server className="text-[#5856d6]" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">What is NS-3?</h2>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          NS-3 (Network Simulator 3) is a <strong className="text-foreground">discrete-event network simulator</strong> primarily used for research and education. It provides realistic models of network protocols and is widely used to simulate wired/wireless networks, test new protocols, and analyze network behavior before real deployment.
        </p>
      </motion.div>

      {/* Feature cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5 transition-colors hover:border-accent/40"
            >
              <Icon size={22} className="mb-3 text-accent" />
              <h4 className="mb-1.5 font-semibold text-foreground">{feat.title}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Architecture stack */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen size={20} className="text-[#5856d6]" />
          NS-3 Architecture Stack
        </h3>
        <div className="space-y-2">
          {architecture.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-4 py-3"
            >
              <div
                className="h-8 w-1.5 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <div>
                <span className="font-medium text-foreground">{layer.layer}</span>
                <span className="ml-2 text-foreground/80">
                  — {layer.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
