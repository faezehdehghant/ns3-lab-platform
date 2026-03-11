"use client";
import { motion } from "framer-motion";
import { Terminal, Bug, FileText, BarChart3 } from "lucide-react";
import CodeBlock from "../CodeBlock";

const commandCategories = [
  {
    title: "Logging",
    icon: FileText,
    description: "NS-3 has a built-in logging system with multiple verbosity levels.",
    commands: [
      {
        label: "Enable in code",
        code: `LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);`,
        lang: "cpp",
      },
      {
        label: "Enable via environment variable",
        code: `export NS_LOG="UdpEchoClientApplication=level_all|prefix_func|prefix_time"`,
        lang: "bash",
      },
      {
        label: "Log levels (most to least verbose)",
        code: `LOG_LEVEL_ALL       // Everything
LOG_LEVEL_DEBUG     // Debug messages
LOG_LEVEL_INFO      // Informational messages
LOG_LEVEL_WARN      // Warnings
LOG_LEVEL_ERROR     // Errors only
LOG_LEVEL_FUNCTION  // Function entry/exit traces`,
        lang: "cpp",
      },
    ],
  },
  {
    title: "Command Line Arguments",
    icon: Terminal,
    description: "Pass runtime parameters to your simulation scripts.",
    commands: [
      {
        label: "Define arguments in code",
        code: `CommandLine cmd;
uint32_t nWifi = 3;
bool verbose = true;
cmd.AddValue("nWifi", "Number of wifi stations", nWifi);
cmd.AddValue("verbose", "Enable logging", verbose);
cmd.Parse(argc, argv);`,
        lang: "cpp",
      },
      {
        label: "Use arguments from command line",
        code: `./ns3 run "scratch/my-script --nWifi=5 --verbose=true"`,
        lang: "bash",
      },
      {
        label: "List available arguments",
        code: `./ns3 run "scratch/my-script --PrintHelp"`,
        lang: "bash",
      },
    ],
  },
  {
    title: "Tracing & Data Collection",
    icon: BarChart3,
    description: "Collect simulation data using ASCII/PCAP tracing or FlowMonitor.",
    commands: [
      {
        label: "Enable ASCII tracing",
        code: `AsciiTraceHelper ascii;
pointToPoint.EnableAsciiAll(ascii.CreateFileStream("first.tr"));`,
        lang: "cpp",
      },
      {
        label: "Enable PCAP tracing",
        code: `pointToPoint.EnablePcapAll("first");
// Creates first-0-0.pcap, first-1-0.pcap`,
        lang: "cpp",
      },
      {
        label: "View PCAP files with tcpdump",
        code: `tcpdump -nn -tt -r first-0-0.pcap`,
        lang: "bash",
      },
      {
        label: "FlowMonitor (throughput, delay, loss)",
        code: `FlowMonitorHelper flowmon;
Ptr<FlowMonitor> monitor = flowmon.InstallAll();
// After simulation:
monitor->SerializeToXmlFile("results.xml", true, true);`,
        lang: "cpp",
      },
    ],
  },
  {
    title: "Debugging",
    icon: Bug,
    description: "Debug your NS-3 scripts with GDB or Valgrind.",
    commands: [
      {
        label: "Run with GDB",
        code: `./ns3 run scratch/first --command-template="gdb %s"`,
        lang: "bash",
      },
      {
        label: "Run with Valgrind",
        code: `./ns3 run scratch/first --command-template="valgrind %s"`,
        lang: "bash",
      },
      {
        label: "Build in debug mode",
        code: `./ns3 configure --build-profile=debug --enable-examples`,
        lang: "bash",
      },
    ],
  },
];

export default function Commands() {
  return (
    <section id="commands" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#f59e0b]/15 p-3">
            <Terminal className="text-[#f59e0b]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Commands & Debugging
            </h2>
            <p className="text-base text-foreground/70">
              Logging, tracing, and debugging tools
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          NS-3 provides powerful tools for logging, data collection, and
          debugging. Master these to efficiently develop and analyze your
          simulations.
        </p>
      </motion.div>

      <div className="space-y-8">
        {commandCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon size={20} className="text-accent" />
                <div>
                  <h3 className="font-semibold text-foreground">{cat.title}</h3>
                  <p className="text-sm text-foreground/80">{cat.description}</p>
                </div>
              </div>

              <div className="space-y-3 ml-8">
                {cat.commands.map((cmd, j) => (
                  <div key={j}>
                    <span className="text-sm font-medium text-foreground/80 mb-1 block">
                      {cmd.label}
                    </span>
                    <CodeBlock
                      code={cmd.code}
                      language={cmd.lang}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
