"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Server,
  Wifi,
  Layers,
  Code2,
  Radio,
  Hammer,
  Terminal,
  Link,
  Menu,
  X,
  GraduationCap,
  FlaskConical,
  Monitor,
} from "lucide-react";

const sections = [
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "getting-started", label: "Getting Started", icon: Monitor },
  { id: "what-is-ns3", label: "What is NS-3?", icon: Server },
  { id: "csma-ca", label: "IEEE 802.11 DCF", icon: Wifi },
  { id: "key-concepts", label: "Key Concepts", icon: Layers },
  { id: "example-1", label: "Example 1: UDP Echo", icon: Code2 },
  { id: "example-2", label: "Example 2: Wireless", icon: Radio },
  { id: "building-scripts", label: "Building Scripts", icon: Hammer },
  { id: "commands", label: "Commands", icon: Terminal },
  { id: "resources", label: "Resources", icon: Link },
  { id: "lab-experiment", label: "Lab Experiment", icon: FlaskConical },
];

interface SidebarProps {
  activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-white/80 p-2 shadow-sm backdrop-blur-xl lg:hidden"
      >
        {isOpen ? <X size={22} className="text-foreground" /> : <Menu size={22} className="text-foreground" />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-card-border/60 bg-sidebar-bg/80 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">NS-3 Lab</h1>
            <p className="text-sm text-foreground/70">EE597 Wireless Networks</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-foreground/70 hover:bg-black/[0.04] hover:text-foreground"
                    }`}
                  >
                    <Icon size={17} />
                    {section.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-card-border/60 px-6 py-4">
          <p className="text-sm text-foreground/70">USC Spring 2025</p>
        </div>
      </aside>
    </>
  );
}
