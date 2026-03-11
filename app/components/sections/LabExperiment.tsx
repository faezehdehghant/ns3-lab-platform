"use client";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Radio,
  Laptop,
  ArrowUpRight,
  ArrowRightLeft,
  BarChart3,
  Settings2,
  Users,
  Gauge,
} from "lucide-react";

const TX_COUNT = 10;
const CX = 250;
const CY = 200;
const RADIUS = 140;

function txPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: CX + RADIUS * Math.cos(angle), y: CY + RADIUS * Math.sin(angle) };
  });
}

export default function LabExperiment() {
  const positions = txPositions(TX_COUNT);

  return (
    <section id="lab-experiment" className="scroll-mt-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#ff3b30]/15 p-3">
            <FlaskConical className="text-[#ff3b30]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Lab Experiment
            </h2>
            <p className="text-base text-foreground/70">
              IEEE 802.11 DCF Saturation Throughput Study
            </p>
          </div>
        </div>

        <p className="mb-8 text-foreground leading-relaxed max-w-2xl">
          Investigate how <strong>CSMA/CA with binary exponential backoff</strong> behaves
          under saturation. You will measure throughput while varying the number of
          transmitting nodes and the offered data rate under two different contention
          window configurations.
        </p>
      </motion.div>

      {/* ══════════ 1. Scenario Topology ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <Radio size={20} className="text-[#ff3b30]" />
          Network Topology
        </h3>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          <div className="border-b border-card-border/40 bg-[#ff3b30]/[0.03] px-5 py-3">
            <span className="text-[15px] font-semibold text-foreground">
              N Transmitters + 1 Receiver — All Within Radio Range
            </span>
          </div>

          <div className="p-6 flex flex-col lg:flex-row items-center gap-8">
            {/* SVG Topology */}
            <div className="flex-1 min-w-0">
              <svg viewBox="0 0 500 400" className="w-full" style={{ maxHeight: 400 }}>
                {/* Wireless range circle */}
                <motion.circle
                  cx={CX} cy={CY} r={RADIUS + 50}
                  fill="none" stroke="#0071e3" strokeWidth={1.5}
                  strokeDasharray="6 4"
                  animate={{ opacity: [0.1, 0.25, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <circle
                  cx={CX} cy={CY} r={RADIUS + 50}
                  fill="#0071e3" opacity={0.02}
                />

                {/* Dashed links from TX → RX */}
                {positions.map((pos, i) => (
                  <motion.line
                    key={`link-${i}`}
                    x1={pos.x} y1={pos.y}
                    x2={CX} y2={CY}
                    stroke="#0071e3" strokeWidth={1}
                    strokeDasharray="4 4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}

                {/* Animated packets flying in */}
                {[0, 3, 6, 8].map((i) => {
                  const pos = positions[i];
                  return (
                    <motion.circle
                      key={`pkt-${i}`}
                      r={4} fill="#ff3b30"
                      initial={{ cx: pos.x, cy: pos.y, opacity: 0 }}
                      animate={{
                        cx: [pos.x, CX],
                        cy: [pos.y, CY],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

                {/* Transmitter nodes */}
                {positions.map((pos, i) => (
                  <motion.g
                    key={`tx-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: i * 0.04 }}
                  >
                    <circle
                      cx={pos.x} cy={pos.y} r={18}
                      fill="#f2f2f7" stroke="#0071e3" strokeWidth={2}
                    />
                    <Laptop x={pos.x - 8} y={pos.y - 8} size={16} color="#0071e3" />
                    <text
                      x={pos.x} y={pos.y + 30}
                      textAnchor="middle" fill="#1d1d1f" fontSize={10} fontWeight="600"
                    >
                      TX {i + 1}
                    </text>
                  </motion.g>
                ))}

                {/* Receiver node (center) */}
                <motion.g
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  <circle
                    cx={CX} cy={CY} r={26}
                    fill="#fff0f0" stroke="#ff3b30" strokeWidth={3}
                  />
                  <Radio x={CX - 10} y={CY - 10} size={20} color="#ff3b30" />
                  <text
                    x={CX} y={CY + 40}
                    textAnchor="middle" fill="#1d1d1f" fontSize={12} fontWeight="700"
                  >
                    Receiver
                  </text>
                </motion.g>

                {/* Labels */}
                <text x={CX} y={28} textAnchor="middle" fill="#1d1d1f" fontSize={13} fontWeight="700">
                  All Nodes Within Radio Range
                </text>
                <text x={CX} y={390} textAnchor="middle" fill="#3a3a3c" fontSize={11}>
                  N transmitters send CBR traffic (512 B packets) to 1 receiver
                </text>
              </svg>
            </div>

            {/* Scenario details */}
            <div className="lg:w-72 shrink-0 space-y-3">
              {[
                { label: "PHY", value: "Default NS-3 WiFi PHY", icon: Settings2 },
                { label: "MAC", value: "IEEE 802.11 DCF (CSMA/CA)", icon: Radio },
                { label: "Traffic", value: "OnOffApplication — CBR", icon: Gauge },
                { label: "Packet Size", value: "512 bytes", icon: ArrowUpRight },
                { label: "Receiver", value: "PacketSink on central node", icon: ArrowRightLeft },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]"
                  >
                    <Icon size={16} className="mt-0.5 text-[#ff3b30] shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      <p className="text-sm text-foreground/80">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════ 2. Case A vs Case B ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <ArrowRightLeft size={20} className="text-[#ff3b30]" />
          Two Contention Window Configurations
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Case A */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#0071e3]/10 to-[#5856d6]/10 px-5 py-4 border-b border-card-border/40">
              <span className="inline-block rounded-full bg-[#0071e3] px-3 py-1 text-sm font-bold text-white mb-2">
                Case A
              </span>
              <h4 className="text-lg font-bold text-foreground">Standard Backoff</h4>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">CW_min</span>
                  <div className="mt-1 rounded-lg bg-[#0071e3]/10 px-3 py-2 text-center">
                    <span className="text-2xl font-bold text-[#0071e3]">1</span>
                    <span className="text-sm text-foreground/70 ml-1">slot</span>
                  </div>
                </div>
                <ArrowRightLeft size={18} className="text-foreground/40 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">CW_max</span>
                  <div className="mt-1 rounded-lg bg-[#5856d6]/10 px-3 py-2 text-center">
                    <span className="text-2xl font-bold text-[#5856d6]">1023</span>
                    <span className="text-sm text-foreground/70 ml-1">slots</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Wide range (1 → 1023). After each collision the CW doubles:
                  1 → 3 → 7 → 15 → 31 → 63 → 127 → 255 → 511 → 1023.
                  Standard binary exponential backoff with a large spread.
                </p>
              </div>
              {/* Backoff ladder visual */}
              <div className="flex items-end gap-[3px] h-16">
                {[1, 3, 7, 15, 31, 63, 127, 255, 511, 1023].map((cw, i) => (
                  <motion.div
                    key={cw}
                    className="flex-1 rounded-t-sm bg-[#0071e3]"
                    style={{ height: `${(Math.log2(cw + 1) / Math.log2(1024)) * 100}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, type: "spring" }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-foreground/60 text-center">CW growth after each collision</p>
            </div>
          </motion.div>

          {/* Case B */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#ff9500]/10 to-[#ff3b30]/10 px-5 py-4 border-b border-card-border/40">
              <span className="inline-block rounded-full bg-[#ff9500] px-3 py-1 text-sm font-bold text-white mb-2">
                Case B
              </span>
              <h4 className="text-lg font-bold text-foreground">Narrow Window</h4>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">CW_min</span>
                  <div className="mt-1 rounded-lg bg-[#ff9500]/10 px-3 py-2 text-center">
                    <span className="text-2xl font-bold text-[#ff9500]">63</span>
                    <span className="text-sm text-foreground/70 ml-1">slots</span>
                  </div>
                </div>
                <ArrowRightLeft size={18} className="text-foreground/40 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">CW_max</span>
                  <div className="mt-1 rounded-lg bg-[#ff3b30]/10 px-3 py-2 text-center">
                    <span className="text-2xl font-bold text-[#ff3b30]">127</span>
                    <span className="text-sm text-foreground/70 ml-1">slots</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-surface px-4 py-3 ring-1 ring-black/[0.04]">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Narrow range (63 → 127). Only one doubling step possible.
                  Higher initial backoff reduces collisions at low load, but
                  the small CW_max limits adaptation at high load.
                </p>
              </div>
              {/* Backoff ladder visual */}
              <div className="flex items-end gap-1 h-16">
                {[63, 127].map((cw, i) => (
                  <motion.div
                    key={cw}
                    className="flex-1 rounded-t-sm bg-[#ff9500]"
                    style={{ height: `${(cw / 127) * 100}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-foreground/60 text-center">CW growth after collision (only 1 step)</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════ 3. Experiments E1 & E2 ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 size={20} className="text-[#ff3b30]" />
          Experiments
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* E1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#34c759]/10 to-[#30b0c7]/10 px-5 py-4 border-b border-card-border/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-full bg-[#34c759] px-3 py-1 text-sm font-bold text-white">
                  E1
                </span>
                <span className="text-sm font-semibold text-foreground/70">For each Case (A & B)</span>
              </div>
              <h4 className="text-lg font-bold text-foreground">Vary Number of Nodes (N)</h4>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <Users size={36} className="text-[#34c759] shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Increase offered load by adding more transmitters</p>
                  <p className="text-sm text-foreground/80 mt-1">
                    Keep data rate R fixed at a reasonable value. Vary N and measure throughput at the receiver for each N.
                  </p>
                </div>
              </div>

              {/* Mini chart illustration */}
              <div className="rounded-xl bg-surface ring-1 ring-black/[0.04] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Throughput vs. N</span>
                  <span className="text-[11px] text-foreground/60">Expected trend</span>
                </div>
                <svg viewBox="0 0 200 80" className="w-full">
                  {/* Axes */}
                  <line x1="30" y1="65" x2="190" y2="65" stroke="#1d1d1f" strokeWidth="1.5" />
                  <line x1="30" y1="65" x2="30" y2="10" stroke="#1d1d1f" strokeWidth="1.5" />
                  <text x="110" y="78" textAnchor="middle" fill="#1d1d1f" fontSize="8" fontWeight="600">Number of Nodes (N)</text>
                  <text x="10" y="40" textAnchor="middle" fill="#1d1d1f" fontSize="7" fontWeight="600" transform="rotate(-90 10 40)">Throughput</text>

                  {/* Aggregate throughput curve — rises then saturates */}
                  <motion.path
                    d="M 35 60 Q 60 30, 90 22 Q 120 17, 150 16 L 185 16"
                    fill="none" stroke="#0071e3" strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                  />
                  <text x="188" y="13" fill="#0071e3" fontSize="6" fontWeight="700">Aggregate</text>

                  {/* Per-node throughput curve — decreases */}
                  <motion.path
                    d="M 35 18 Q 60 30, 90 45 Q 130 55, 185 60"
                    fill="none" stroke="#ff3b30" strokeWidth="2" strokeDasharray="4 2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                  <text x="188" y="58" fill="#ff3b30" fontSize="6" fontWeight="700">Per-node</text>
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-foreground/80">
                  <strong className="text-foreground">Measure:</strong> Aggregate throughput &
                  per-node throughput for each N
                </p>
              </div>
            </div>
          </motion.div>

          {/* E2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#af52de]/10 to-[#ff2d55]/10 px-5 py-4 border-b border-card-border/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-full bg-[#af52de] px-3 py-1 text-sm font-bold text-white">
                  E2
                </span>
                <span className="text-sm font-semibold text-foreground/70">For each Case (A & B)</span>
              </div>
              <h4 className="text-lg font-bold text-foreground">Vary Data Rate (R)</h4>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <Gauge size={36} className="text-[#af52de] shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Increase offered load by raising data rate</p>
                  <p className="text-sm text-foreground/80 mt-1">
                    Fix number of nodes at N = 20. Vary the offered data rate R in fine granularity and measure throughput.
                  </p>
                </div>
              </div>

              {/* Mini chart illustration */}
              <div className="rounded-xl bg-surface ring-1 ring-black/[0.04] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Throughput vs. R</span>
                  <span className="text-[11px] text-foreground/60">Expected trend</span>
                </div>
                <svg viewBox="0 0 200 80" className="w-full">
                  {/* Axes */}
                  <line x1="30" y1="65" x2="190" y2="65" stroke="#1d1d1f" strokeWidth="1.5" />
                  <line x1="30" y1="65" x2="30" y2="10" stroke="#1d1d1f" strokeWidth="1.5" />
                  <text x="110" y="78" textAnchor="middle" fill="#1d1d1f" fontSize="8" fontWeight="600">Offered Data Rate (R Mbps)</text>
                  <text x="10" y="40" textAnchor="middle" fill="#1d1d1f" fontSize="7" fontWeight="600" transform="rotate(-90 10 40)">Throughput</text>

                  {/* Throughput curve — linear then saturates */}
                  <motion.path
                    d="M 35 60 L 70 35 Q 100 18, 130 16 L 185 16"
                    fill="none" stroke="#0071e3" strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                  />
                  <text x="188" y="13" fill="#0071e3" fontSize="6" fontWeight="700">Aggregate</text>

                  {/* Offered load reference line (45 degree) */}
                  <motion.path
                    d="M 35 60 L 100 20"
                    fill="none" stroke="#1d1d1f" strokeWidth="1" strokeDasharray="3 3"
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                  <text x="103" y="18" fill="#1d1d1f" fontSize="5" opacity={0.4}>Offered load</text>

                  {/* Saturation line */}
                  <line x1="30" y1="16" x2="185" y2="16" stroke="#ff3b30" strokeWidth="0.8" strokeDasharray="2 2" opacity={0.5} />
                  <text x="188" y="19" fill="#ff3b30" fontSize="5">Saturation</text>
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-foreground/80">
                  <strong className="text-foreground">Measure:</strong> Aggregate throughput &
                  per-node throughput for each R value
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════ 4. Complete Evaluation Matrix ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 size={20} className="text-[#ff3b30]" />
          Evaluation Matrix
        </h3>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-card-border/60">
                  <th className="px-5 py-3 text-left font-semibold text-foreground"></th>
                  <th className="px-5 py-3 text-center font-semibold text-foreground">
                    <span className="inline-block rounded-full bg-[#0071e3] px-2.5 py-0.5 text-xs font-bold text-white">Case A</span>
                    <br />
                    <span className="text-xs text-foreground/70">CW: 1 → 1023</span>
                  </th>
                  <th className="px-5 py-3 text-center font-semibold text-foreground">
                    <span className="inline-block rounded-full bg-[#ff9500] px-2.5 py-0.5 text-xs font-bold text-white">Case B</span>
                    <br />
                    <span className="text-xs text-foreground/70">CW: 63 → 127</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-card-border/30">
                  <td className="px-5 py-4">
                    <span className="inline-block rounded-full bg-[#34c759] px-2.5 py-0.5 text-xs font-bold text-white mr-2">E1</span>
                    <span className="font-medium text-foreground">Vary N</span>
                    <p className="text-xs text-foreground/70 mt-1">Throughput vs. N (22 pts)</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="space-y-1">
                      <div className="rounded-lg bg-[#0071e3]/[0.06] px-3 py-1.5 text-xs font-medium text-[#0071e3]">Aggregate: 10 pts</div>
                      <div className="rounded-lg bg-[#5856d6]/[0.06] px-3 py-1.5 text-xs font-medium text-[#5856d6]">Per-node: 10 pts</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="space-y-1">
                      <div className="rounded-lg bg-[#ff9500]/[0.06] px-3 py-1.5 text-xs font-medium text-[#ff9500]">Aggregate: 10 pts</div>
                      <div className="rounded-lg bg-[#ff3b30]/[0.06] px-3 py-1.5 text-xs font-medium text-[#ff3b30]">Per-node: 10 pts</div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-card-border/30">
                  <td className="px-5 py-4">
                    <span className="inline-block rounded-full bg-[#af52de] px-2.5 py-0.5 text-xs font-bold text-white mr-2">E2</span>
                    <span className="font-medium text-foreground">Vary R</span>
                    <p className="text-xs text-foreground/70 mt-1">Throughput vs. R (22 pts)</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="space-y-1">
                      <div className="rounded-lg bg-[#0071e3]/[0.06] px-3 py-1.5 text-xs font-medium text-[#0071e3]">Aggregate: 10 pts</div>
                      <div className="rounded-lg bg-[#5856d6]/[0.06] px-3 py-1.5 text-xs font-medium text-[#5856d6]">Per-node: 10 pts</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="space-y-1">
                      <div className="rounded-lg bg-[#ff9500]/[0.06] px-3 py-1.5 text-xs font-medium text-[#ff9500]">Aggregate: 10 pts</div>
                      <div className="rounded-lg bg-[#ff3b30]/[0.06] px-3 py-1.5 text-xs font-medium text-[#ff3b30]">Per-node: 10 pts</div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-card-border/30">
                  <td className="px-5 py-4" colSpan={3}>
                    <span className="font-medium text-foreground">Discussion — 12 pts</span>
                    <p className="text-xs text-foreground/70 mt-1">Compare Case A vs B, explain saturation behavior, visualize data</p>
                  </td>
                </tr>
                <tr className="bg-[#ff9500]/[0.03]">
                  <td className="px-5 py-4" colSpan={3}>
                    <span className="font-medium text-[#ff9500]">Bonus (10 pts)</span>
                    <p className="text-xs text-foreground/70 mt-1">
                      Mean & variance of backoff slots per TX vs. N/R (+5 pts) &bull; Collision rate vs. N/R (+5 pts)
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ══════════ 5. Key Tips ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
          <Settings2 size={20} className="text-[#ff3b30]" />
          Implementation Tips
        </h3>

        <div className="space-y-3">
          {[
            {
              title: "Changing CW values",
              desc: "Modify NS-3 source files: wifi-phy.cc, txop.cc, wifi-helper.h in ~/ns-3-allinone/ns-3-dev/src/wifi/. Reading the source is the easiest way.",
              color: "#ff3b30",
            },
            {
              title: "Single script approach",
              desc: "Create one lab1.cc file with command-line arguments for case/experiment selection. Use a Lab1Run.sh bash script to run all configurations.",
              color: "#0071e3",
            },
            {
              title: "Steady-state measurement",
              desc: "Run the simulation long enough to reach saturation. Use FlowMonitor to collect throughput metrics. Average over multiple runs for reliable estimates.",
              color: "#34c759",
            },
            {
              title: "Node placement",
              desc: "Place all N transmitters uniformly in the terrain, ensuring every node is within radio range of every other node and the receiver.",
              color: "#af52de",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="flex items-start gap-4 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] px-5 py-4"
            >
              <div
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: tip.color }}
              />
              <div>
                <span className="font-semibold text-foreground">{tip.title}</span>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
