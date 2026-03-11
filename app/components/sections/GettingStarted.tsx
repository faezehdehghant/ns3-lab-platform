"use client";
import { motion } from "framer-motion";
import {
  Monitor,
  KeyRound,
  FileCode,
  Terminal as TerminalIcon,
  Info,
  CheckCircle2,
  ExternalLink,
  Apple,
} from "lucide-react";
import CodeBlock from "../CodeBlock";

const exampleFiles = [
  {
    path: "~/ns-3-allinone/ns-3-dev/examples/wireless/wifi-pcf.cc",
    desc: "WiFi PCF (Point Coordination Function) example",
  },
  {
    path: "~/ns-3-allinone/ns-3-dev/examples/wireless/wireless-ad-hoc.cc",
    desc: "Wireless ad-hoc network example",
  },
  {
    path: "~/ns-3-allinone/ns-3-dev/examples/tutorial/third.cc",
    desc: "WiFi + P2P mixed topology tutorial",
  },
];

const wafCommands = `# Run example with different RSS values
./waf --run "wifi-simple-adhoc --rss=-97 --numPackets=20"
./waf --run "wifi-simple-adhoc --rss=-98 --numPackets=20"
./waf --run "wifi-simple-adhoc --rss=-99 --numPackets=20"

# Drop your script into scratch/ and run it
./waf --run yourscript`;

const docLinks = [
  { label: "Install NS-3", url: "https://www.nsnam.org/wiki/Installation#Installation" },
  { label: "NS-3 Releases", url: "https://www.nsnam.org/release/" },
  { label: "API Docs (Doxygen)", url: "https://www.nsnam.org/doxygen/index.html" },
  { label: "Key Concepts", url: "https://www.nsnam.org/docs/tutorial/html/conceptual-overview.html" },
  { label: "Building Topologies", url: "https://www.nsnam.org/docs/tutorial/html/building-topologies.html" },
  { label: "Wireless Topology", url: "https://www.nsnam.org/docs/release/3.8/tutorial/tutorial_27.html" },
];

export default function GettingStarted() {
  return (
    <section id="getting-started" className="scroll-mt-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#5856d6]/15 p-3">
            <Monitor className="text-[#5856d6]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Getting Started
            </h2>
            <p className="text-base text-foreground/70">
              Environment setup and first steps
            </p>
          </div>
        </div>

        <p className="mb-8 text-foreground leading-relaxed max-w-2xl">
          Set up your development environment using the provided virtual machine image,
          then explore the example scripts to get familiar with NS-3 before starting the lab.
        </p>
      </motion.div>

      {/* ══════════ VM Setup ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <Monitor size={20} className="text-[#5856d6]" />
          Virtual Machine Setup
        </h3>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          <div className="border-b border-card-border/40 bg-[#5856d6]/[0.04] px-5 py-4">
            <p className="text-foreground font-medium">
              Use <strong>VirtualBox</strong> to run the provided Ubuntu 18.04 VM image,
              which has NS-3 preinstalled.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Credentials */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]">
                <KeyRound size={18} className="text-[#5856d6] shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-foreground">Username</span>
                  <p className="text-lg font-mono font-bold text-[#5856d6]">ee597</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]">
                <KeyRound size={18} className="text-[#5856d6] shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-foreground">Password</span>
                  <p className="text-lg font-mono font-bold text-[#5856d6]">ee597</p>
                </div>
              </div>
            </div>

            {/* NS-3 location */}
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]">
              <FileCode size={18} className="text-[#5856d6] shrink-0" />
              <div>
                <span className="text-sm font-semibold text-foreground">NS-3 Location</span>
                <p className="text-sm font-mono text-foreground/80">~/ns-3-allinone/ns-3-dev/</p>
              </div>
            </div>

            {/* Platform notes */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-[#34c759]/30 bg-[#34c759]/[0.05] px-4 py-3">
                <CheckCircle2 size={18} className="text-[#34c759] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Windows users</span>
                  <p className="text-sm text-foreground/80">
                    The VM image <strong>just works</strong> with VirtualBox on Windows — download VirtualBox, import the image, and you are ready to go. No extra configuration needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#0071e3]/30 bg-[#0071e3]/[0.05] px-4 py-3">
                <Apple size={18} className="text-[#0071e3] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">macOS users</span>
                  <p className="text-sm text-foreground/80">
                    VirtualBox works on Intel Macs. For Apple Silicon (M1/M2/M3), use UTM or another ARM-compatible virtualizer to run the VM image.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#ff9500]/30 bg-[#ff9500]/[0.05] px-4 py-3">
                <Info size={18} className="text-[#ff9500] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Native Ubuntu 18.04</span>
                  <p className="text-sm text-foreground/80">
                    If you prefer coding in your native environment, that is fine — but <strong>make sure to test in the VM before final submission</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════ Example Files to Study ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <FileCode size={20} className="text-[#5856d6]" />
          Example Files to Study
        </h3>

        <p className="mb-4 text-foreground/80">
          Before writing your own script, study these example files to understand
          how NS-3 wireless simulations are structured:
        </p>

        <div className="space-y-3">
          {exampleFiles.map((file, i) => (
            <motion.div
              key={file.path}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-5 py-4"
            >
              <code className="text-sm font-mono font-semibold text-[#5856d6] break-all">
                {file.path}
              </code>
              <p className="mt-1 text-sm text-foreground/80">{file.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══════════ Running Examples ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <TerminalIcon size={20} className="text-[#5856d6]" />
          Compiling & Running
        </h3>

        <p className="mb-4 text-foreground/80">
          Run these commands from the NS-3 root directory. You may need to{" "}
          <a
            href="https://www.nsnam.org/wiki/Installation#Installation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium underline underline-offset-2"
          >
            enable examples
          </a>{" "}
          if working in your native environment.
        </p>

        <CodeBlock
          code={wafCommands}
          language="bash"
          title="Terminal — NS-3 root directory"
        />

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/[0.04] px-5 py-4">
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">Tip</span>
            <p className="text-sm text-foreground/80">
              Drop your script into the <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-accent font-mono text-sm">scratch/</code> directory
              and it will automatically build and run with Waf. No need to modify any build files.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══════════ Documentation Links ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <ExternalLink size={20} className="text-[#5856d6]" />
          Documentation & References
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-4 py-3 transition-all hover:ring-[#5856d6]/40 hover:bg-[#5856d6]/[0.03]"
            >
              <ExternalLink size={14} className="text-[#5856d6] shrink-0" />
              <span className="text-sm font-medium text-foreground group-hover:text-[#5856d6] transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
