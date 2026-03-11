"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Introduction from "./components/sections/Introduction";
import WhatIsNS3 from "./components/sections/WhatIsNS3";
import CSMACA from "./components/sections/CSMACA";
import KeyConcepts from "./components/sections/KeyConcepts";
import Example1 from "./components/sections/Example1";
import Example2 from "./components/sections/Example2";
import BuildingScripts from "./components/sections/BuildingScripts";
import Commands from "./components/sections/Commands";
import Resources from "./components/sections/Resources";
import LabExperiment from "./components/sections/LabExperiment";

const sectionIds = [
  "introduction",
  "what-is-ns3",
  "csma-ca",
  "key-concepts",
  "example-1",
  "example-2",
  "building-scripts",
  "commands",
  "resources",
  "lab-experiment",
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aIdx = sectionIds.indexOf(a.target.id);
            const bIdx = sectionIds.indexOf(b.target.id);
            return aIdx - bIdx;
          });
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} />
      <main className="flex-1 lg:ml-72">
        <div className="mx-auto max-w-4xl px-6 py-16 space-y-24 text-base leading-relaxed">
          <Introduction />
          <WhatIsNS3 />
          <CSMACA />
          <KeyConcepts />
          <Example1 />
          <Example2 />
          <BuildingScripts />
          <Commands />
          <Resources />
          <LabExperiment />

          {/* Footer */}
          <footer className="border-t border-card-border/40 pt-8 pb-12 text-center">
            <p className="text-sm text-foreground/70">
              EE597 Wireless Networks — USC Spring 2026
            </p>
            <p className="mt-1 text-xs text-foreground/50">
              Built with Next.js, Tailwind CSS, and Framer Motion
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
