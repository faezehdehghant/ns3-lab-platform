"use client";
import { motion } from "framer-motion";
import { Hammer, FolderTree, Play, Copy, Settings } from "lucide-react";
import CodeBlock from "../CodeBlock";

const buildCommands = [
  {
    title: "Configure NS-3 (First Time)",
    description: "Run once to configure the build system with examples and tests enabled.",
    command: `./ns3 configure --enable-examples --enable-tests`,
    icon: Settings,
  },
  {
    title: "Build NS-3",
    description: "Compile all NS-3 modules. Run after configuration or code changes.",
    command: `./ns3 build`,
    icon: Hammer,
  },
  {
    title: "Run a Script",
    description: "Execute an NS-3 simulation script from the scratch/ directory.",
    command: `./ns3 run scratch/first`,
    icon: Play,
  },
  {
    title: "Run with Arguments",
    description: "Pass command-line arguments to your simulation script.",
    command: `./ns3 run "scratch/third --nWifi=5"`,
    icon: Play,
  },
];

const directoryStructure = `ns-3-dev/
├── src/              # NS-3 modules (wifi, internet, etc.)
│   ├── wifi/
│   ├── internet/
│   ├── network/
│   └── ...
├── scratch/          # YOUR simulation scripts go here
│   ├── first.cc
│   ├── third.cc
│   └── my-script.cc
├── examples/         # Example scripts (read-only reference)
├── build/            # Compiled output
└── ns3               # Build/run tool (replaces old waf)`;

export default function BuildingScripts() {
  return (
    <section id="building-scripts" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#ff2d55]/15 p-3">
            <Hammer className="text-[#ff2d55]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Building & Running Scripts
            </h2>
            <p className="text-base text-foreground/70">
              NS-3 build system and workflow
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          NS-3 uses a CMake-based build system accessed via the{" "}
          <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-accent font-mono text-sm">
            ./ns3
          </code>{" "}
          command. Place your simulation scripts in the{" "}
          <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-accent font-mono text-sm">
            scratch/
          </code>{" "}
          directory, build, and run.
        </p>
      </motion.div>

      {/* Directory Structure */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
          <FolderTree size={20} className="text-[#ff2d55]" />
          Directory Structure
        </h3>
        <CodeBlock
          code={directoryStructure}
          language="bash"
          title="NS-3 Project Layout"
        />
      </motion.div>

      {/* Build Commands */}
      <h3 className="mb-4 text-lg font-semibold text-foreground">Key Commands</h3>
      <div className="space-y-4">
        {buildCommands.map((cmd, i) => {
          const Icon = cmd.icon;
          return (
            <motion.div
              key={cmd.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-card-border">
                <Icon size={18} className="text-accent" />
                <div>
                  <h4 className="font-medium text-foreground">{cmd.title}</h4>
                  <p className="text-sm text-foreground/80">{cmd.description}</p>
                </div>
              </div>
              <CodeBlock code={cmd.command} language="bash" />
            </motion.div>
          );
        })}
      </div>

      {/* Workflow tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 rounded-xl border border-accent/30 bg-accent/[0.04] p-5"
      >
        <div className="flex items-start gap-3">
          <Copy size={20} className="mt-0.5 text-accent shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Workflow Tip</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Copy example scripts to scratch/ before modifying:
            </p>
            <code className="mt-2 block rounded bg-surface px-3 py-2 text-xs text-accent font-mono">
              cp examples/tutorial/first.cc scratch/my-first.cc
            </code>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
