"use client";
import { motion } from "framer-motion";
import {
  Link,
  BookOpen,
  Video,
  FileText,
  Github,
  Globe,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

const resources = [
  {
    category: "Official Documentation",
    icon: BookOpen,
    items: [
      {
        title: "NS-3 Tutorial",
        description: "Official getting-started tutorial covering all basics",
        url: "https://www.nsnam.org/docs/tutorial/html/",
      },
      {
        title: "NS-3 Manual",
        description: "Comprehensive reference manual for all modules",
        url: "https://www.nsnam.org/docs/manual/html/",
      },
      {
        title: "NS-3 API Documentation",
        description: "Full API reference (Doxygen) for all classes",
        url: "https://www.nsnam.org/docs/doxygen/",
      },
    ],
  },
  {
    category: "Source Code & Downloads",
    icon: Github,
    items: [
      {
        title: "NS-3 Official Website",
        description: "Download NS-3, news, and announcements",
        url: "https://www.nsnam.org/",
      },
      {
        title: "NS-3 on GitLab",
        description: "Source code repository and issue tracker",
        url: "https://gitlab.com/nsnam/ns-3-dev",
      },
    ],
  },
  {
    category: "Learning Resources",
    icon: Video,
    items: [
      {
        title: "NS-3 Wiki",
        description: "Community-maintained guides and tips",
        url: "https://www.nsnam.org/wiki/",
      },
      {
        title: "NS-3 Google Groups",
        description: "Community forum for questions and discussions",
        url: "https://groups.google.com/g/ns-3-users",
      },
    ],
  },
  {
    category: "WiFi / 802.11 References",
    icon: Globe,
    items: [
      {
        title: "IEEE 802.11 Standard",
        description: "Official IEEE 802.11 wireless LAN standard",
        url: "https://standards.ieee.org/standard/802_11-2020.html",
      },
      {
        title: "802.11 DCF Explained",
        description: "Visual explanation of CSMA/CA and DCF",
        url: "https://en.wikipedia.org/wiki/Distributed_coordination_function",
      },
    ],
  },
];

const quickTips = [
  {
    icon: FileText,
    tip: "Always check examples/ directory for reference implementations before writing from scratch.",
  },
  {
    icon: MessageSquare,
    tip: "Use NS_LOG environment variable to debug without recompiling.",
  },
  {
    icon: GraduationCap,
    tip: "Start with simple topologies and gradually add complexity.",
  },
];

export default function Resources() {
  return (
    <section id="resources" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#007aff]/15 p-3">
            <Link className="text-[#007aff]" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Resources</h2>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          Useful links and references for NS-3 development and IEEE 802.11
          learning.
        </p>
      </motion.div>

      {/* Resource cards */}
      <div className="space-y-6 mb-8">
        {resources.map((category, i) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Icon size={18} className="text-accent" />
                {category.category}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4 transition-all hover:border-accent/40 hover:bg-accent/[0.04]"
                  >
                    <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-foreground/80">
                      {item.description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Open <span className="text-xs">&#8599;</span>
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Tips</h3>
        <div className="space-y-3">
          {quickTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-4 py-3"
              >
                <Icon size={18} className="mt-0.5 text-accent shrink-0" />
                <p className="text-[15px] text-foreground/80">{tip.tip}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
