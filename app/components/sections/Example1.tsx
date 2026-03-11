"use client";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import CodeBlock from "../CodeBlock";
import StepWalkthrough from "../StepWalkthrough";
import NetworkDiagram from "../NetworkDiagram";

const fullCode = `#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("FirstScriptExample");

int main(int argc, char *argv[]) {
    CommandLine cmd;
    cmd.Parse(argc, argv);

    Time::SetResolution(Time::NS);
    LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
    LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);

    // Create 2 nodes
    NodeContainer nodes;
    nodes.Create(2);

    // Configure point-to-point link
    PointToPointHelper pointToPoint;
    pointToPoint.SetDeviceAttribute("DataRate", StringValue("5Mbps"));
    pointToPoint.SetChannelAttribute("Delay", StringValue("2ms"));

    // Install devices
    NetDeviceContainer devices;
    devices = pointToPoint.Install(nodes);

    // Install Internet stack
    InternetStackHelper stack;
    stack.Install(nodes);

    // Assign IP addresses
    Ipv4AddressHelper address;
    address.SetBase("10.1.1.0", "255.255.255.0");
    Ipv4InterfaceContainer interfaces = address.Assign(devices);

    // Setup UDP Echo Server on Node 1
    UdpEchoServerHelper echoServer(9);
    ApplicationContainer serverApps = echoServer.Install(nodes.Get(1));
    serverApps.Start(Seconds(1.0));
    serverApps.Stop(Seconds(10.0));

    // Setup UDP Echo Client on Node 0
    UdpEchoClientHelper echoClient(interfaces.GetAddress(1), 9);
    echoClient.SetAttribute("MaxPackets", UintegerValue(1));
    echoClient.SetAttribute("Interval", TimeValue(Seconds(1.0)));
    echoClient.SetAttribute("PacketSize", UintegerValue(1024));

    ApplicationContainer clientApps = echoClient.Install(nodes.Get(0));
    clientApps.Start(Seconds(2.0));
    clientApps.Stop(Seconds(10.0));

    Simulator::Run();
    Simulator::Destroy();
    return 0;
}`;

const codeAnnotations: Record<number, string> = {
  1: "Include NS-3 core modules for simulation primitives",
  10: "Define a logging component for this script",
  19: "Create a container with 2 nodes (Node 0 and Node 1)",
  23: "Configure a Point-to-Point link: 5 Mbps, 2ms delay",
  28: "Install the P2P net devices on both nodes",
  31: "Install TCP/IP protocol stack on both nodes",
  35: "Assign IP addresses from the 10.1.1.0/24 subnet",
  38: "Create UDP Echo Server listening on port 9",
  43: "Create UDP Echo Client pointing to server's IP and port",
};

const steps = [
  {
    title: "Include Modules & Setup Logging",
    description:
      "Include the necessary NS-3 modules (core, network, internet, point-to-point, applications). Define a logging component and enable logging for the echo applications.",
    code: `#include "ns3/core-module.h"\n#include "ns3/network-module.h"\nNS_LOG_COMPONENT_DEFINE("FirstScriptExample");`,
  },
  {
    title: "Create Nodes",
    description:
      "Create a NodeContainer and add 2 nodes. These are bare computing devices with no network stack yet.",
    code: `NodeContainer nodes;\nnodes.Create(2);`,
  },
  {
    title: "Configure Point-to-Point Link",
    description:
      "Set up a Point-to-Point helper with 5 Mbps data rate and 2ms propagation delay. Install the link devices on both nodes.",
    code: `PointToPointHelper pointToPoint;\npointToPoint.SetDeviceAttribute("DataRate", StringValue("5Mbps"));\npointToPoint.SetChannelAttribute("Delay", StringValue("2ms"));\nNetDeviceContainer devices = pointToPoint.Install(nodes);`,
  },
  {
    title: "Install Internet Stack & Assign IPs",
    description:
      "Install the TCP/IP protocol stack on both nodes and assign IP addresses from the 10.1.1.0/24 subnet.",
    code: `InternetStackHelper stack;\nstack.Install(nodes);\nIpv4AddressHelper address;\naddress.SetBase("10.1.1.0", "255.255.255.0");\nIpv4InterfaceContainer interfaces = address.Assign(devices);`,
  },
  {
    title: "Install Applications",
    description:
      "Install a UDP Echo Server on Node 1 (port 9) and a UDP Echo Client on Node 0 that sends 1 packet of 1024 bytes to the server.",
    code: `UdpEchoServerHelper echoServer(9);\nechoServer.Install(nodes.Get(1));\n\nUdpEchoClientHelper echoClient(interfaces.GetAddress(1), 9);\nechoClient.SetAttribute("MaxPackets", UintegerValue(1));\nechoClient.SetAttribute("PacketSize", UintegerValue(1024));\nechoClient.Install(nodes.Get(0));`,
  },
  {
    title: "Run Simulation",
    description:
      "Start the simulation event loop. The simulator processes all scheduled events and then exits. Always call Destroy() to free resources.",
    code: `Simulator::Run();\nSimulator::Destroy();`,
  },
];

const diagramNodes = [
  { id: "n0", label: "Node 0", x: 150, y: 150, color: "#1e293b" },
  { id: "n1", label: "Node 1", x: 450, y: 150, color: "#1e293b" },
];

const diagramLinks = [
  { source: "n0", target: "n1", label: "P2P: 5Mbps, 2ms" },
];

export default function Example1() {
  return (
    <section id="example-1" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#30b0c7]/15 p-3">
            <Code2 className="text-[#30b0c7]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Example 1: UDP Echo (Point-to-Point)
            </h2>
            <p className="text-base text-foreground/70">
              first.cc — Your first NS-3 script
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          This example creates two nodes connected by a point-to-point link. A
          UDP Echo Client on Node 0 sends a packet to the UDP Echo Server on
          Node 1, which echoes it back.
        </p>
      </motion.div>

      {/* Network Diagram */}
      <NetworkDiagram
        nodes={diagramNodes}
        links={diagramLinks}
        title="Network Topology — Point-to-Point"
        width={600}
        height={200}
      />

      {/* Node info cards */}
      <div className="my-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
          <span className="text-sm font-bold text-[#30b0c7]">Node 0</span>
          <p className="text-[15px] text-foreground/80 mt-1">
            UDP Echo Client — sends 1024-byte packet to 10.1.1.2:9
          </p>
          <span className="text-sm text-foreground/80">IP: 10.1.1.1</span>
        </div>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
          <span className="text-sm font-bold text-[#30b0c7]">Node 1</span>
          <p className="text-[15px] text-foreground/80 mt-1">
            UDP Echo Server — listens on port 9, echoes packets back
          </p>
          <span className="text-sm text-foreground/80">IP: 10.1.1.2</span>
        </div>
      </div>

      {/* Step-by-step walkthrough */}
      <StepWalkthrough
        steps={steps}
        title="Code Walkthrough"
      />

      {/* Full code */}
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-semibold text-foreground">Complete Code</h3>
        <CodeBlock
          code={fullCode}
          language="cpp"
          title="scratch/first.cc"
          annotations={codeAnnotations}
        />
      </div>

      {/* Expected output */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Expected Output
        </h3>
        <CodeBlock
          code={`At time +2s client sent 1024 bytes to 10.1.1.2 port 9
At time +2.00369s server received 1024 bytes from 10.1.1.1 port 49153
At time +2.00369s server sent 1024 bytes to 10.1.1.1 port 49153
At time +2.00737s client received 1024 bytes from 10.1.1.2 port 9`}
          language="bash"
          title="Terminal Output"
        />
      </motion.div>
    </section>
  );
}
