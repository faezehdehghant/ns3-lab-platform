"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Laptop,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";

/* ─────────── Types ─────────── */
type ChannelState = "idle" | "busy" | "collision";
type NodeState =
  | "idle"
  | "sensing"
  | "difs"
  | "backoff"
  | "rts"
  | "cts-wait"
  | "data"
  | "ack-wait"
  | "frozen"
  | "done";

interface PacketFlight {
  from: string;
  to: string;
  label: string;
  color: string;
}

interface StepState {
  title: string;
  description: string;
  channel: ChannelState;
  nodes: Record<string, { state: NodeState; backoff: number | null; cw?: number }>;
  packets?: PacketFlight[];
  highlight?: string;
  channelLabel?: string;
  time: number; // cursor position on the timeline
}

/* ─────────── Timeline Events (the horizontal bar data) ─────────── */

interface TimelineBlock {
  row: "A" | "B" | "C" | "Channel";
  start: number;
  duration: number;
  label: string;
  color: string;
  textColor?: string;
}

const TOTAL_SLOTS = 27;

const TIMELINE_BLOCKS: TimelineBlock[] = [
  // ── Laptop A ──
  { row: "A", start: 0, duration: 1, label: "Sense", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "A", start: 1, duration: 1, label: "DIFS", color: "#f59e0b", textColor: "#1d1d1f" },
  { row: "A", start: 2, duration: 5, label: "Backoff (5→0)", color: "#38bdf8", textColor: "#1d1d1f" },
  { row: "A", start: 7, duration: 1, label: "RTS", color: "#0ea5e9", textColor: "#1d1d1f" },
  { row: "A", start: 8, duration: 1, label: "CTS", color: "#4ade80", textColor: "#064e3b" },
  { row: "A", start: 9, duration: 4, label: "DATA", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "A", start: 13, duration: 1, label: "ACK", color: "#a78bfa", textColor: "#1d1d1f" },
  { row: "A", start: 14, duration: 13, label: "Done", color: "#dcfce7", textColor: "#248a3d" },

  // ── Laptop B ──
  { row: "B", start: 0, duration: 1, label: "Sense", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "B", start: 1, duration: 1, label: "DIFS", color: "#f59e0b", textColor: "#1d1d1f" },
  { row: "B", start: 2, duration: 5, label: "Backoff (10→5)", color: "#38bdf8", textColor: "#1d1d1f" },
  { row: "B", start: 7, duration: 7, label: "Frozen (5)", color: "#ef4444", textColor: "#1d1d1f" },
  { row: "B", start: 14, duration: 1, label: "DIFS", color: "#f59e0b", textColor: "#1d1d1f" },
  { row: "B", start: 15, duration: 5, label: "Resume (5→0)", color: "#38bdf8", textColor: "#1d1d1f" },
  { row: "B", start: 20, duration: 1, label: "RTS", color: "#0ea5e9", textColor: "#1d1d1f" },
  { row: "B", start: 21, duration: 1, label: "CTS", color: "#4ade80", textColor: "#064e3b" },
  { row: "B", start: 22, duration: 4, label: "DATA", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "B", start: 26, duration: 1, label: "ACK", color: "#a78bfa", textColor: "#1d1d1f" },

  // ── Laptop C ──
  { row: "C", start: 0, duration: 7, label: "Idle", color: "#e2e8f0", textColor: "#424245" },
  { row: "C", start: 7, duration: 7, label: "NAV (defer)", color: "#fecaca", textColor: "#d70015" },
  { row: "C", start: 14, duration: 6, label: "Idle", color: "#e2e8f0", textColor: "#424245" },
  { row: "C", start: 20, duration: 7, label: "NAV (defer)", color: "#fecaca", textColor: "#d70015" },

  // ── Channel ──
  { row: "Channel", start: 0, duration: 7, label: "Idle", color: "#dcfce7", textColor: "#248a3d" },
  { row: "Channel", start: 7, duration: 1, label: "RTS", color: "#0ea5e9", textColor: "#1d1d1f" },
  { row: "Channel", start: 8, duration: 1, label: "CTS", color: "#4ade80", textColor: "#064e3b" },
  { row: "Channel", start: 9, duration: 4, label: "DATA (A)", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "Channel", start: 13, duration: 1, label: "ACK", color: "#a78bfa", textColor: "#1d1d1f" },
  { row: "Channel", start: 14, duration: 6, label: "Idle", color: "#dcfce7", textColor: "#248a3d" },
  { row: "Channel", start: 20, duration: 1, label: "RTS", color: "#0ea5e9", textColor: "#1d1d1f" },
  { row: "Channel", start: 21, duration: 1, label: "CTS", color: "#4ade80", textColor: "#064e3b" },
  { row: "Channel", start: 22, duration: 4, label: "DATA (B)", color: "#fbbf24", textColor: "#1d1d1f" },
  { row: "Channel", start: 26, duration: 1, label: "ACK", color: "#a78bfa", textColor: "#1d1d1f" },
];

const TIMELINE_ROWS: { id: "A" | "B" | "C" | "Channel"; label: string; icon: "laptop" | "radio" }[] = [
  { id: "A", label: "Laptop A", icon: "laptop" },
  { id: "B", label: "Laptop B", icon: "laptop" },
  { id: "C", label: "Laptop C", icon: "laptop" },
  { id: "Channel", label: "Channel", icon: "radio" },
];

/* ─────────── Scenario Steps ─────────── */

const STEPS: StepState[] = [
  {
    title: "Initial State",
    description:
      "Three laptops (A, B, C) are associated with one Access Point (AP). Laptops A and B both have data to send at the same time. Laptop C is idle.",
    channel: "idle",
    nodes: {
      A: { state: "idle", backoff: null },
      B: { state: "idle", backoff: null },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "Channel Idle",
    time: 0,
  },
  {
    title: "1. Carrier Sensing",
    description:
      "Laptops A and B want to transmit. They first listen to the wireless medium (carrier sensing). The channel is currently idle.",
    channel: "idle",
    nodes: {
      A: { state: "sensing", backoff: null },
      B: { state: "sensing", backoff: null },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "Channel Idle",
    highlight: "A",
    time: 0.5,
  },
  {
    title: "2. DIFS Waiting",
    description:
      "Since the channel is free, both A and B wait for a DIFS period (DCF Interframe Space = 50 \u00b5s for 802.11a). This mandatory wait ensures no higher-priority traffic (like ACKs using SIFS) is pending.",
    channel: "idle",
    nodes: {
      A: { state: "difs", backoff: null },
      B: { state: "difs", backoff: null },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "DIFS (50 \u00b5s)",
    time: 1.5,
  },
  {
    title: "3. Random Backoff Selection",
    description:
      "After DIFS, both stations select a random backoff from [0, CW]. With CW = 15, Laptop A randomly picks 5 slots and Laptop B picks 10 slots. Each slot is 9 \u00b5s (802.11a). The backoff timer only counts down while the channel is idle.",
    channel: "idle",
    nodes: {
      A: { state: "backoff", backoff: 5, cw: 15 },
      B: { state: "backoff", backoff: 10, cw: 15 },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "Channel Idle \u2014 Countdown Active",
    time: 2,
  },
  {
    title: "4. Backoff Countdown",
    description:
      "Both timers decrement while the channel stays idle. After 3 slots, A is at 2 and B is at 7. A is winning the race because it drew the smaller number.",
    channel: "idle",
    nodes: {
      A: { state: "backoff", backoff: 2, cw: 15 },
      B: { state: "backoff", backoff: 7, cw: 15 },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "Channel Idle \u2014 Countdown Active",
    time: 5,
  },
  {
    title: "5. A\u2019s Timer Hits Zero \u2014 Sends RTS",
    description:
      "Laptop A\u2019s backoff reaches 0 first! It immediately sends an RTS (Request to Send) frame to the AP, reserving the channel. The RTS includes the duration of the entire upcoming transaction.",
    channel: "busy",
    nodes: {
      A: { state: "rts", backoff: 0, cw: 15 },
      B: { state: "frozen", backoff: 5, cw: 15 },
      C: { state: "idle", backoff: null },
    },
    packets: [{ from: "A", to: "AP", label: "RTS", color: "#38bdf8" }],
    highlight: "A",
    channelLabel: "Channel BUSY \u2014 RTS from A",
    time: 7,
  },
  {
    title: "6. AP Replies with CTS",
    description:
      "The AP receives A\u2019s RTS and responds with a CTS (Clear to Send) after a SIFS interval. Laptop B hears the CTS and freezes its backoff timer at 5. Laptop C also hears the CTS and sets its NAV (Network Allocation Vector) to defer.",
    channel: "busy",
    nodes: {
      A: { state: "cts-wait", backoff: 0, cw: 15 },
      B: { state: "frozen", backoff: 5, cw: 15 },
      C: { state: "frozen", backoff: null },
    },
    packets: [{ from: "AP", to: "A", label: "CTS", color: "#4ade80" }],
    highlight: "AP",
    channelLabel: "Channel BUSY \u2014 CTS from AP",
    time: 8,
  },
  {
    title: "7. A Sends Data",
    description:
      "After receiving the CTS, Laptop A transmits its data frame to the AP. The channel remains busy. B\u2019s timer stays frozen at 5, and C continues to defer.",
    channel: "busy",
    nodes: {
      A: { state: "data", backoff: 0, cw: 15 },
      B: { state: "frozen", backoff: 5, cw: 15 },
      C: { state: "frozen", backoff: null },
    },
    packets: [{ from: "A", to: "AP", label: "DATA", color: "#fbbf24" }],
    highlight: "A",
    channelLabel: "Channel BUSY \u2014 DATA from A",
    time: 10,
  },
  {
    title: "8. AP Sends ACK",
    description:
      "The AP successfully receives A\u2019s data and sends back an ACK (Acknowledgment) after a SIFS interval. This confirms successful delivery. Laptop A\u2019s transmission is complete!",
    channel: "busy",
    nodes: {
      A: { state: "ack-wait", backoff: null, cw: 15 },
      B: { state: "frozen", backoff: 5, cw: 15 },
      C: { state: "frozen", backoff: null },
    },
    packets: [{ from: "AP", to: "A", label: "ACK", color: "#a78bfa" }],
    highlight: "AP",
    channelLabel: "Channel BUSY \u2014 ACK to A",
    time: 13,
  },
  {
    title: "9. Channel Idle \u2014 B Resumes",
    description:
      "A\u2019s transaction is complete. After the channel is idle for DIFS, Laptop B resumes its frozen backoff timer from 5. It counts down: 5 \u2192 4 \u2192 3 \u2192 2 \u2192 1 \u2192 0.",
    channel: "idle",
    nodes: {
      A: { state: "done", backoff: null },
      B: { state: "backoff", backoff: 5, cw: 15 },
      C: { state: "idle", backoff: null },
    },
    highlight: "B",
    channelLabel: "Channel Idle \u2014 B Resumes Countdown",
    time: 16,
  },
  {
    title: "10. B\u2019s Timer Hits Zero \u2014 Sends RTS",
    description:
      "Laptop B\u2019s backoff reaches 0. It sends an RTS to the AP. The AP replies with CTS, then B sends DATA and receives an ACK \u2014 completing its transmission successfully. No collision occurred thanks to CSMA/CA!",
    channel: "busy",
    nodes: {
      A: { state: "done", backoff: null },
      B: { state: "rts", backoff: 0, cw: 15 },
      C: { state: "frozen", backoff: null },
    },
    packets: [{ from: "B", to: "AP", label: "RTS", color: "#38bdf8" }],
    highlight: "B",
    channelLabel: "Channel BUSY \u2014 RTS from B",
    time: 20,
  },
  {
    title: "11. Success!",
    description:
      "Both A and B transmitted successfully without collision! The random backoff mechanism of CSMA/CA ensured that even though both wanted to transmit simultaneously, they took turns. The station with the smaller backoff goes first, while others freeze and resume later.",
    channel: "idle",
    nodes: {
      A: { state: "done", backoff: null },
      B: { state: "done", backoff: null },
      C: { state: "idle", backoff: null },
    },
    channelLabel: "All Transmissions Complete",
    time: 27,
  },
];

/* ─────────── Helpers ─────────── */

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 100, y: 80 },
  B: { x: 100, y: 200 },
  C: { x: 100, y: 320 },
  AP: { x: 460, y: 200 },
};

const stateColors: Record<NodeState, string> = {
  idle: "#0071e3",
  sensing: "#fbbf24",
  difs: "#fbbf24",
  backoff: "#38bdf8",
  rts: "#38bdf8",
  "cts-wait": "#4ade80",
  data: "#fbbf24",
  "ack-wait": "#a78bfa",
  frozen: "#ef4444",
  done: "#248a3d",
};

const stateLabels: Record<NodeState, string> = {
  idle: "Idle",
  sensing: "Sensing...",
  difs: "DIFS Wait",
  backoff: "Backoff",
  rts: "Sending RTS",
  "cts-wait": "Waiting CTS",
  data: "Sending DATA",
  "ack-wait": "Waiting ACK",
  frozen: "FROZEN",
  done: "Done",
};

/* ─────────── Component ─────────── */

export default function BackoffAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);

  const step = STEPS[currentStep];

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= STEPS.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextStep, speed);
    return () => clearInterval(interval);
  }, [isPlaying, nextStep, speed]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const progressPct = (currentStep / (STEPS.length - 1)) * 100;
  const timeScale = 28; // px per time slot

  const packetLines = useMemo(() => {
    if (!step.packets) return [];
    return step.packets.map((p) => {
      const from = NODE_POSITIONS[p.from];
      const to = NODE_POSITIONS[p.to];
      return { ...p, x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    });
  }, [step.packets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-6 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/[0.04] bg-white"
    >
      {/* ═══════════ Header ═══════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border/60 bg-gradient-to-r from-accent/[0.06] to-purple-500/[0.06] px-5 py-3">
        <div>
          <h3 className="font-bold text-foreground">
            CSMA/CA with RTS/CTS — Interactive Scenario
          </h3>
          <p className="text-xs text-foreground/70">
            3 Laptops + 1 Access Point
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-lg border border-card-border bg-surface px-2 py-1.5 text-xs text-foreground outline-none"
          >
            <option value={4000}>0.5x</option>
            <option value={2500}>1x</option>
            <option value={1500}>2x</option>
            <option value={800}>4x</option>
          </select>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-lg bg-accent/20 p-2 text-accent transition-colors hover:bg-accent/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-black/[0.04] p-2 text-foreground/70 transition-colors hover:bg-black/[0.08]"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* ═══════════ Network Topology SVG ═══════════ */}
        <div className="rounded-xl border border-card-border/60 bg-surface p-3 overflow-x-auto">
          <svg viewBox="0 0 560 390" className="w-full" style={{ minWidth: 460, maxHeight: 390 }}>
            {/* Wireless range circle around AP */}
            <motion.circle
              cx={460} cy={200} r={180}
              fill="none" stroke="#0071e3" strokeWidth={1}
              strokeDasharray="6 4" opacity={0.12}
            />
            <motion.circle
              cx={460} cy={200} r={180}
              fill="none" stroke="#0071e3" strokeWidth={1.5}
              strokeDasharray="6 4"
              animate={{ opacity: [0.06, 0.18, 0.06] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Connection lines */}
            {["A", "B", "C"].map((id) => {
              const n = NODE_POSITIONS[id];
              const ap = NODE_POSITIONS.AP;
              const nodeState = step.nodes[id]?.state || "idle";
              const isActive = ["rts", "data", "sensing", "cts-wait", "ack-wait"].includes(nodeState);
              return (
                <motion.line
                  key={`line-${id}`}
                  x1={n.x + 30} y1={n.y}
                  x2={ap.x - 30} y2={ap.y}
                  stroke={isActive ? stateColors[nodeState] : "#d2d2d7"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray="8 4"
                  animate={{ opacity: isActive ? 0.8 : 0.4, strokeWidth: isActive ? 2 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}

            {/* Packet animations */}
            <AnimatePresence mode="wait">
              {packetLines.map((p, i) => {
                const midX = (p.x1 + p.x2) / 2;
                const midY = (p.y1 + p.y2) / 2;
                return (
                  <motion.g key={`pkt-${currentStep}-${i}`}>
                    <motion.circle
                      r={6} fill={p.color} filter="url(#glow)"
                      initial={{ cx: p.x1, cy: p.y1, opacity: 0 }}
                      animate={{ cx: [p.x1, midX, p.x2], cy: [p.y1, midY, p.y2], opacity: [0, 1, 0.3] }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                      stroke={p.color} strokeWidth={2.5}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 0.7, 0.2] }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <motion.g
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <rect x={midX - 22} y={midY - 24} width={44} height={20} rx={6} fill={p.color} opacity={0.9} />
                      <text x={midX} y={midY - 11} textAnchor="middle" fill="#1d1d1f" fontSize={11} fontWeight="700">
                        {p.label}
                      </text>
                    </motion.g>
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* Nodes (A, B, C) */}
            {(["A", "B", "C"] as const).map((id) => {
              const pos = NODE_POSITIONS[id];
              const ns = step.nodes[id] || { state: "idle" as NodeState, backoff: null };
              const color = stateColors[ns.state];
              const isHighlighted = step.highlight === id;
              const isFrozen = ns.state === "frozen";
              return (
                <motion.g key={id}>
                  {isHighlighted && (
                    <motion.circle
                      cx={pos.x} cy={pos.y} r={32}
                      fill="none" stroke={color} strokeWidth={2}
                      initial={{ r: 26, opacity: 0.8 }}
                      animate={{ r: [26, 40], opacity: [0.6, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                  {["rts", "data"].includes(ns.state) &&
                    [1, 2, 3].map((ring) => (
                      <motion.circle
                        key={ring} cx={pos.x} cy={pos.y}
                        fill="none" stroke={color} strokeWidth={1}
                        initial={{ r: 28, opacity: 0.5 }}
                        animate={{ r: 28 + ring * 18, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: ring * 0.3 }}
                      />
                    ))}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={26}
                    fill="#f5f5f7" stroke={color} strokeWidth={2.5}
                    animate={{ stroke: color, filter: isHighlighted ? `drop-shadow(0 0 8px ${color}80)` : "none" }}
                    transition={{ duration: 0.3 }}
                  />
                  <Laptop x={pos.x - 10} y={pos.y - 10} size={20} color={color} />
                  <text x={pos.x} y={pos.y + 42} textAnchor="middle" fill="#1d1d1f" fontSize={13} fontWeight="700">
                    Laptop {id}
                  </text>
                  <motion.text
                    key={`state-${id}-${currentStep}`}
                    x={pos.x} y={pos.y + 56}
                    textAnchor="middle" fill={color} fontSize={10} fontWeight="600"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    {stateLabels[ns.state]}
                  </motion.text>
                  {ns.backoff !== null && (
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                      <rect x={pos.x + 18} y={pos.y - 36} width={32} height={24} rx={8} fill={isFrozen ? "#ef4444" : "#0071e3"} opacity={0.9} />
                      <text x={pos.x + 34} y={pos.y - 20} textAnchor="middle" fill="#fbfbfd" fontSize={13} fontWeight="800">
                        {ns.backoff}
                      </text>
                      {isFrozen && (
                        <motion.text
                          x={pos.x + 34} y={pos.y - 40}
                          textAnchor="middle" fill="#ef4444" fontSize={8} fontWeight="700"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          PAUSED
                        </motion.text>
                      )}
                    </motion.g>
                  )}
                  {ns.cw !== undefined && ns.state === "backoff" && (
                    <text x={pos.x - 32} y={pos.y - 24} textAnchor="end" fill="#424245" fontSize={9}>
                      CW={ns.cw}
                    </text>
                  )}
                </motion.g>
              );
            })}

            {/* Access Point */}
            {(() => {
              const ap = NODE_POSITIONS.AP;
              const isAPActive = step.highlight === "AP" || step.packets?.some((p) => p.from === "AP");
              const apColor = isAPActive ? "#248a3d" : "#0071e3";
              return (
                <motion.g>
                  {isAPActive &&
                    [1, 2, 3].map((ring) => (
                      <motion.circle
                        key={ring} cx={ap.x} cy={ap.y}
                        fill="none" stroke={apColor} strokeWidth={1}
                        initial={{ r: 32, opacity: 0.5 }}
                        animate={{ r: 32 + ring * 20, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: ring * 0.3 }}
                      />
                    ))}
                  <motion.circle
                    cx={ap.x} cy={ap.y} r={30}
                    fill="#f5f5f7" stroke={apColor} strokeWidth={3}
                    animate={{ stroke: apColor, filter: isAPActive ? `drop-shadow(0 0 10px ${apColor}80)` : "none" }}
                  />
                  <Radio x={ap.x - 12} y={ap.y - 12} size={24} color={apColor} />
                  <text x={ap.x} y={ap.y + 46} textAnchor="middle" fill="#1d1d1f" fontSize={14} fontWeight="700">
                    Access Point
                  </text>
                </motion.g>
              );
            })()}

            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* ═══════════ Timeline View ═══════════ */}
        <div className="rounded-xl border border-card-border/60 bg-surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-card-border/60 bg-accent/[0.03] px-4 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-foreground">Timeline — Time Slots</span>
            <span className="ml-auto text-[10px] text-foreground/70">
              Playhead at slot {Math.floor(step.time)}
            </span>
          </div>

          <div className="overflow-x-auto p-4">
            <div style={{ minWidth: TOTAL_SLOTS * timeScale + 90 }}>
              {/* Time axis */}
              <div className="mb-1 flex items-end" style={{ paddingLeft: 82 }}>
                {Array.from({ length: TOTAL_SLOTS + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ width: timeScale, flexShrink: 0 }}
                  >
                    <span className="text-[9px] text-foreground font-mono">{i}</span>
                    <div className="h-1.5 w-px bg-card-border" />
                  </div>
                ))}
              </div>

              {/* Rows */}
              {TIMELINE_ROWS.map((row) => {
                const rowBlocks = TIMELINE_BLOCKS.filter((b) => b.row === row.id);
                const isChannelRow = row.id === "Channel";
                return (
                  <div
                    key={row.id}
                    className={`flex items-center ${isChannelRow ? "mt-2 pt-2 border-t border-card-border/50" : ""}`}
                    style={{ height: 34 }}
                  >
                    {/* Row label */}
                    <div className="w-[82px] shrink-0 flex items-center gap-1.5 pr-2">
                      {row.icon === "laptop" ? (
                        <Laptop size={12} className="text-accent" />
                      ) : (
                        <Radio size={12} className="text-accent" />
                      )}
                      <span className="text-[11px] font-medium text-foreground truncate">
                        {row.label}
                      </span>
                    </div>

                    {/* Track */}
                    <div
                      className="relative h-[26px] rounded-[4px] bg-surface"
                      style={{ width: TOTAL_SLOTS * timeScale }}
                    >
                      {/* Slot grid lines */}
                      {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 h-full border-l border-card-border/30"
                          style={{ left: i * timeScale }}
                        />
                      ))}

                      {/* Blocks */}
                      {rowBlocks.map((block, bi) => {
                        const blockEnd = block.start + block.duration;
                        const isPast = step.time >= blockEnd;
                        const isCurrent = step.time >= block.start && step.time < blockEnd;
                        const isFuture = step.time < block.start;

                        return (
                          <motion.div
                            key={bi}
                            className="absolute top-[2px] flex items-center justify-center rounded-[3px] overflow-hidden"
                            style={{
                              left: block.start * timeScale + 1,
                              width: block.duration * timeScale - 2,
                              height: 22,
                              backgroundColor: block.color,
                              opacity: isFuture ? 0.25 : isCurrent ? 1 : 0.6,
                            }}
                            animate={{
                              opacity: isFuture ? 0.25 : isCurrent ? 1 : 0.6,
                              scale: isCurrent ? 1 : 1,
                            }}
                            transition={{ duration: 0.35 }}
                          >
                            {/* Current block glow */}
                            {isCurrent && (
                              <motion.div
                                className="absolute inset-0 rounded-[3px]"
                                style={{ boxShadow: `0 0 8px ${block.color}60, inset 0 0 8px ${block.color}30` }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                            <span
                              className="relative z-10 text-[9px] font-bold leading-none truncate px-1"
                              style={{ color: block.textColor || "#1d1d1f" }}
                            >
                              {block.duration * timeScale > 28 ? block.label : ""}
                            </span>
                          </motion.div>
                        );
                      })}

                      {/* Playhead cursor */}
                      <motion.div
                        className="absolute top-0 h-full w-[2px] bg-foreground z-20"
                        style={{ boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
                        animate={{ left: step.time * timeScale }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Legend row inside timeline box */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-card-border/40 px-4 py-2 text-[10px]">
            {[
              { label: "Sense/DIFS", color: "#fbbf24" },
              { label: "Backoff", color: "#38bdf8" },
              { label: "RTS", color: "#0ea5e9" },
              { label: "CTS", color: "#4ade80" },
              { label: "DATA", color: "#fbbf24" },
              { label: "ACK", color: "#a78bfa" },
              { label: "Frozen/NAV", color: "#ef4444" },
              { label: "Idle", color: "#d2d2d7" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="h-2 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 ml-1">
              <div className="h-3 w-[2px] rounded bg-foreground" />
              <span className="text-foreground">Playhead</span>
            </div>
          </div>
        </div>

        {/* ═══════════ Channel Status Bar ═══════════ */}
        <div className="flex items-center gap-3 rounded-lg border border-card-border/60 bg-surface px-4 py-2.5">
          {step.channel === "idle" ? (
            <Wifi size={18} className="text-success" />
          ) : step.channel === "collision" ? (
            <WifiOff size={18} className="text-error" />
          ) : (
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <Wifi size={18} className="text-warning" />
            </motion.div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  step.channel === "idle"
                    ? "text-success"
                    : step.channel === "collision"
                    ? "text-error"
                    : "text-warning"
                }`}
              >
                {step.channel === "idle" ? "IDLE" : step.channel === "collision" ? "COLLISION!" : "BUSY"}
              </span>
              <span className="text-xs text-foreground/70">{step.channelLabel}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {["A", "B", "C"].map((id) => {
              const ns = step.nodes[id];
              if (!ns) return null;
              const color = stateColors[ns.state];
              return (
                <div key={id} className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-foreground font-medium">{id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ Step Description ═══════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-card-border/60 bg-surface p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                {currentStep + 1} / {STEPS.length}
              </span>
              <h4 className="font-bold text-foreground">{step.title}</h4>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ═══════════ Controls ═══════════ */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
            disabled={currentStep === 0}
            className="flex items-center gap-1 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-card-border/30 disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button
            onClick={() => { setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1)); setIsPlaying(false); }}
            disabled={currentStep === STEPS.length - 1}
            className="flex items-center gap-1 rounded-lg bg-accent/20 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/30 disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
          <div className="ml-auto flex items-center gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? "w-5 bg-accent" : i < currentStep ? "w-2 bg-accent/40" : "w-2 bg-card-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ Bottom progress bar ═══════════ */}
      <div className="h-1 bg-card-border/40">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-purple-400"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
