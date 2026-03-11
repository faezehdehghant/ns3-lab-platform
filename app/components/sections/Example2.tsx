"use client";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import CodeBlock from "../CodeBlock";
import StepWalkthrough from "../StepWalkthrough";
import NetworkDiagram from "../NetworkDiagram";

const fullCode = `#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/wifi-module.h"
#include "ns3/mobility-module.h"
#include "ns3/applications-module.h"
#include "ns3/point-to-point-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("WirelessExample");

int main(int argc, char *argv[]) {
    uint32_t nWifi = 3;
    CommandLine cmd;
    cmd.AddValue("nWifi", "Number of wifi STA devices", nWifi);
    cmd.Parse(argc, argv);

    // Create P2P nodes (wired backbone)
    NodeContainer p2pNodes;
    p2pNodes.Create(2);

    PointToPointHelper pointToPoint;
    pointToPoint.SetDeviceAttribute("DataRate", StringValue("5Mbps"));
    pointToPoint.SetChannelAttribute("Delay", StringValue("2ms"));
    NetDeviceContainer p2pDevices = pointToPoint.Install(p2pNodes);

    // Create WiFi station nodes
    NodeContainer wifiStaNodes;
    wifiStaNodes.Create(nWifi);
    NodeContainer wifiApNode = p2pNodes.Get(0); // AP is P2P node 0

    // Configure WiFi channel and PHY
    YansWifiChannelHelper channel = YansWifiChannelHelper::Default();
    YansWifiPhyHelper phy;
    phy.SetChannel(channel.Create());

    // Configure WiFi MAC
    WifiHelper wifi;
    WifiMacHelper mac;
    Ssid ssid = Ssid("ns-3-ssid");

    // STA devices
    mac.SetType("ns3::StaWifiMac",
                "Ssid", SsidValue(ssid),
                "ActiveProbing", BooleanValue(false));
    NetDeviceContainer staDevices = wifi.Install(phy, mac, wifiStaNodes);

    // AP device
    mac.SetType("ns3::ApWifiMac",
                "Ssid", SsidValue(ssid));
    NetDeviceContainer apDevices = wifi.Install(phy, mac, wifiApNode);

    // Mobility
    MobilityHelper mobility;
    mobility.SetPositionAllocator("ns3::GridPositionAllocator",
        "MinX", DoubleValue(0.0),
        "MinY", DoubleValue(0.0),
        "DeltaX", DoubleValue(5.0),
        "DeltaY", DoubleValue(10.0),
        "GridWidth", UintegerValue(3),
        "LayoutType", StringValue("RowFirst"));

    mobility.SetMobilityModel("ns3::RandomWalk2dMobilityModel",
        "Bounds", RectangleValue(Rectangle(-50, 50, -50, 50)));
    mobility.Install(wifiStaNodes);

    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(wifiApNode);

    // Internet stack
    InternetStackHelper stack;
    stack.Install(p2pNodes.Get(1));
    stack.Install(wifiStaNodes);
    stack.Install(wifiApNode);

    // IP addresses
    Ipv4AddressHelper address;
    address.SetBase("10.1.1.0", "255.255.255.0");
    address.Assign(p2pDevices);

    address.SetBase("10.1.2.0", "255.255.255.0");
    Ipv4InterfaceContainer wifiInterfaces;
    wifiInterfaces = address.Assign(staDevices);
    address.Assign(apDevices);

    // Applications (similar to Example 1)
    UdpEchoServerHelper echoServer(9);
    ApplicationContainer serverApps = echoServer.Install(p2pNodes.Get(1));
    serverApps.Start(Seconds(1.0));
    serverApps.Stop(Seconds(10.0));

    UdpEchoClientHelper echoClient(
        p2pNodes.Get(1)->GetObject<Ipv4>()->GetAddress(1, 0).GetLocal(), 9);
    echoClient.SetAttribute("MaxPackets", UintegerValue(1));
    echoClient.SetAttribute("Interval", TimeValue(Seconds(1.0)));
    echoClient.SetAttribute("PacketSize", UintegerValue(1024));

    ApplicationContainer clientApps = echoClient.Install(wifiStaNodes.Get(nWifi - 1));
    clientApps.Start(Seconds(2.0));
    clientApps.Stop(Seconds(10.0));

    Ipv4GlobalRoutingHelper::PopulateRoutingTables();

    Simulator::Stop(Seconds(10.0));
    Simulator::Run();
    Simulator::Destroy();
    return 0;
}`;

const steps = [
  {
    title: "Create Wired Backbone (P2P)",
    description:
      "Create 2 nodes connected by a 5 Mbps, 2ms point-to-point link. This forms the wired backbone. Node 0 will also serve as the WiFi AP.",
    code: `NodeContainer p2pNodes;\np2pNodes.Create(2);\nPointToPointHelper p2p;\np2p.SetDeviceAttribute("DataRate", StringValue("5Mbps"));\np2p.Install(p2pNodes);`,
  },
  {
    title: "Create WiFi Stations",
    description:
      "Create 3 WiFi station (STA) nodes. The AP role is given to p2pNodes.Get(0), which bridges the wired and wireless networks.",
    code: `NodeContainer wifiStaNodes;\nwifiStaNodes.Create(nWifi);\nNodeContainer wifiApNode = p2pNodes.Get(0);`,
  },
  {
    title: "Configure WiFi PHY & Channel",
    description:
      "Use YansWifiChannelHelper and YansWifiPhyHelper to set up the wireless physical layer with default settings (propagation loss, delay).",
    code: `YansWifiChannelHelper channel = YansWifiChannelHelper::Default();\nYansWifiPhyHelper phy;\nphy.SetChannel(channel.Create());`,
  },
  {
    title: "Configure WiFi MAC (STA & AP)",
    description:
      "Set up station MAC (StaWifiMac) with an SSID and no active probing, then AP MAC (ApWifiMac). Install on respective nodes.",
    code: `mac.SetType("ns3::StaWifiMac", "Ssid", SsidValue(ssid));\nstaDevices = wifi.Install(phy, mac, wifiStaNodes);\nmac.SetType("ns3::ApWifiMac", "Ssid", SsidValue(ssid));\napDevices = wifi.Install(phy, mac, wifiApNode);`,
  },
  {
    title: "Set Up Mobility",
    description:
      "STAs use RandomWalk2dMobilityModel (random movement within a 100x100m area). The AP uses ConstantPositionMobilityModel (stationary).",
    code: `mobility.SetMobilityModel("ns3::RandomWalk2dMobilityModel",\n  "Bounds", RectangleValue(Rectangle(-50, 50, -50, 50)));\nmobility.Install(wifiStaNodes);\nmobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");\nmobility.Install(wifiApNode);`,
  },
  {
    title: "Install Stack, IPs & Applications",
    description:
      "Install Internet stack, assign IPs (10.1.1.x for P2P, 10.1.2.x for WiFi). Run UDP Echo client on a STA, server on the wired node. Populate routing tables.",
    code: `InternetStackHelper stack;\nstack.Install(allNodes);\nIpv4GlobalRoutingHelper::PopulateRoutingTables();`,
  },
];

const diagramNodes = [
  { id: "sta0", label: "STA 0", x: 80, y: 80 },
  { id: "sta1", label: "STA 1", x: 80, y: 180 },
  { id: "sta2", label: "STA 2", x: 80, y: 280 },
  { id: "ap", label: "AP", x: 280, y: 180, color: "#1e3a2e" },
  { id: "server", label: "Server", x: 480, y: 180 },
];

const diagramLinks = [
  { source: "sta0", target: "ap", label: "WiFi", dashed: true },
  { source: "sta1", target: "ap", label: "WiFi", dashed: true },
  { source: "sta2", target: "ap", label: "WiFi", dashed: true },
  { source: "ap", target: "server", label: "P2P 5Mbps" },
];

export default function Example2() {
  return (
    <section id="example-2" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#34c759]/15 p-3">
            <Radio className="text-[#34c759]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Example 2: Wireless Topology
            </h2>
            <p className="text-base text-foreground/70">
              third.cc — WiFi + Point-to-Point
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          This example creates a mixed wired-wireless topology: WiFi stations
          communicate through an Access Point (AP) that is also connected to a
          wired server via a Point-to-Point link.
        </p>
      </motion.div>

      {/* Network Diagram */}
      <NetworkDiagram
        nodes={diagramNodes}
        links={diagramLinks}
        title="Network Topology — Wireless + P2P"
        width={560}
        height={360}
      />

      {/* Topology summary */}
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
          <span className="text-sm font-bold text-[#34c759]">WiFi STAs</span>
          <p className="text-[15px] text-foreground/80 mt-1">
            3 mobile stations with RandomWalk2d mobility
          </p>
          <span className="text-sm text-foreground/80">Subnet: 10.1.2.0/24</span>
        </div>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
          <span className="text-xs font-bold text-success">Access Point</span>
          <p className="text-[15px] text-foreground/80 mt-1">
            Bridges WiFi and wired network, stationary
          </p>
          <span className="text-sm text-foreground/80">SSID: ns-3-ssid</span>
        </div>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
          <span className="text-xs font-bold text-warning">Wired Server</span>
          <p className="text-[15px] text-foreground/80 mt-1">
            UDP Echo Server on port 9
          </p>
          <span className="text-sm text-foreground/80">Subnet: 10.1.1.0/24</span>
        </div>
      </div>

      {/* Step walkthrough */}
      <StepWalkthrough steps={steps} title="Code Walkthrough" />

      {/* Full code */}
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-semibold text-foreground">Complete Code</h3>
        <CodeBlock
          code={fullCode}
          language="cpp"
          title="scratch/third.cc"
        />
      </div>
    </section>
  );
}
