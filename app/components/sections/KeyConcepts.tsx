"use client";
import { motion } from "framer-motion";
import { Layers, Monitor, Cpu, Cable, Wrench, AppWindow } from "lucide-react";
import CodeBlock from "../CodeBlock";

const concepts = [
  {
    icon: Monitor,
    title: "Node",
    description:
      "A computing device in the simulation. Think of it as a bare computer — no network stack until you add one. Created via NodeContainer.",
    code: `NodeContainer nodes;\nnodes.Create(2); // Create 2 nodes`,
    color: "#38bdf8",
  },
  {
    icon: Cpu,
    title: "NetDevice",
    description:
      "A network interface card (NIC). Connects a Node to a Channel. Different types: CsmaNetDevice, WifiNetDevice, PointToPointNetDevice.",
    code: `PointToPointHelper p2p;\np2p.SetDeviceAttribute("DataRate", StringValue("5Mbps"));\nNetDeviceContainer devices = p2p.Install(nodes);`,
    color: "#4ade80",
  },
  {
    icon: Cable,
    title: "Channel",
    description:
      "The communication medium (wire or wireless). Connects NetDevices together. Channels model propagation delay and loss.",
    code: `p2p.SetChannelAttribute("Delay", StringValue("2ms"));`,
    color: "#fbbf24",
  },
  {
    icon: Wrench,
    title: "Helpers",
    description:
      'Helper classes simplify configuration. They follow the "factory" pattern — create and configure complex objects with a few lines.',
    code: `InternetStackHelper stack;\nstack.Install(nodes); // Adds TCP/IP stack\n\nIpv4AddressHelper address;\naddress.SetBase("10.1.1.0", "255.255.255.0");\nIpv4InterfaceContainer interfaces = address.Assign(devices);`,
    color: "#a78bfa",
  },
  {
    icon: AppWindow,
    title: "Application",
    description:
      "Traffic generators installed on nodes. NS-3 provides UdpEchoServer, UdpEchoClient, OnOffApplication, PacketSink, and more.",
    code: `UdpEchoServerHelper echoServer(9); // Port 9\nApplicationContainer serverApps = echoServer.Install(nodes.Get(1));\nserverApps.Start(Seconds(1.0));\nserverApps.Stop(Seconds(10.0));`,
    color: "#f472b6",
  },
];

export default function KeyConcepts() {
  return (
    <section id="key-concepts" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#af52de]/15 p-3">
            <Layers className="text-[#af52de]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Key NS-3 Concepts</h2>
            <p className="text-base text-foreground/70">
              Core building blocks for simulations
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          Every NS-3 simulation is built from five fundamental abstractions:{" "}
          <strong className="text-foreground">Node</strong>,{" "}
          <strong className="text-foreground">NetDevice</strong>,{" "}
          <strong className="text-foreground">Channel</strong>,{" "}
          <strong className="text-foreground">Helpers</strong>, and{" "}
          <strong className="text-foreground">Applications</strong>.
        </p>
      </motion.div>

      {/* Concept cards */}
      <div className="space-y-6 mb-8">
        {concepts.map((concept, i) => {
          const Icon = concept.icon;
          return (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-card-border px-5 py-4">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: concept.color + "15" }}
                >
                  <Icon size={20} style={{ color: concept.color }} />
                </div>
                <h4 className="font-semibold text-foreground">{concept.title}</h4>
              </div>
              <div className="px-5 py-4">
                <p className="text-[15px] text-foreground/80 leading-relaxed mb-3">
                  {concept.description}
                </p>
                <CodeBlock
                  code={concept.code}
                  language="cpp"
                  title={`${concept.title.toLowerCase()}_example.cc`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
