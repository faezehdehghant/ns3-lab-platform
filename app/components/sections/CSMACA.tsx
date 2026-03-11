"use client";
import { motion } from "framer-motion";
import { Wifi, AlertTriangle, Shield, Radio } from "lucide-react";
import BackoffAnimation from "../BackoffAnimation";
import Quiz from "../Quiz";

const dcfSteps = [
  {
    step: "1. Carrier Sensing",
    description: "A station wanting to transmit listens to the medium. If the channel is busy, it waits until the channel becomes idle.",
    color: "#fbbf24",
  },
  {
    step: "2. DIFS Waiting",
    description: "If the channel is free, the station waits for a specific duration called the Distributed Inter-Frame Space (DIFS = 50 \u00b5s for 802.11a).",
    color: "#fbbf24",
  },
  {
    step: "3. Random Backoff",
    description: "To avoid collisions, the station selects a random backoff time from [0, CW] (Contention Window, initially 15). The timer decrements only while the channel is idle. If the channel becomes busy, the timer pauses (freezes).",
    color: "#38bdf8",
  },
  {
    step: "4. Transmission (RTS/CTS)",
    description: "Once the backoff timer reaches zero, the station sends an RTS frame. The receiver replies with a CTS frame. Neighboring stations hear the CTS and set their NAV to defer.",
    color: "#4ade80",
  },
  {
    step: "5. Data & ACK",
    description: "The station sends its data frame. The receiver responds with an ACK to confirm successful reception. The channel is then released.",
    color: "#a78bfa",
  },
  {
    step: "6. Collision Handling",
    description: "If a collision occurs (no ACK received), the Contention Window doubles (Binary Exponential Backoff): CW goes 15 \u2192 31 \u2192 63 \u2192 127 \u2192 255 \u2192 511 \u2192 1023. A larger CW means a wider random range, reducing future collision probability.",
    color: "#f87171",
  },
];

const rtsCtsConcepts = [
  {
    title: "RTS (Request to Send)",
    desc: "Sender broadcasts RTS with duration info. Neighbors hear it and set NAV (Network Allocation Vector).",
  },
  {
    title: "CTS (Clear to Send)",
    desc: "Receiver responds with CTS. Hidden nodes hear CTS and defer transmission.",
  },
  {
    title: "DATA",
    desc: "Sender transmits the data frame after receiving CTS.",
  },
  {
    title: "ACK",
    desc: "Receiver acknowledges successful reception.",
  },
];

const quizQuestions = [
  {
    question: "What does CSMA/CA stand for?",
    options: [
      "Carrier Sense Multiple Access / Collision Avoidance",
      "Carrier Sense Multiple Access / Collision Detection",
      "Channel Sense Multiple Access / Collision Avoidance",
      "Carrier Signal Multiple Access / Collision Avoidance",
    ],
    correctIndex: 0,
    explanation:
      "CSMA/CA = Carrier Sense Multiple Access with Collision Avoidance. Unlike Ethernet's CSMA/CD, WiFi cannot detect collisions during transmission due to the nature of wireless signals.",
  },
  {
    question:
      "What happens to the contention window (CW) after a collision in 802.11 DCF?",
    options: [
      "CW resets to minimum",
      "CW is doubled (Binary Exponential Backoff)",
      "CW remains the same",
      "CW is halved",
    ],
    correctIndex: 1,
    explanation:
      "After a collision, the contention window doubles (Binary Exponential Backoff). Starting from CWmin=15, it goes to 31, 63, 127, etc., up to CWmax=1023.",
  },
  {
    question:
      "Why can't WiFi use collision detection (CD) like Ethernet?",
    options: [
      "WiFi is too fast for CD",
      "A node cannot transmit and listen simultaneously on wireless",
      "WiFi uses different frequencies",
      "Collision detection is patented",
    ],
    correctIndex: 1,
    explanation:
      "In wireless communications, a transmitting node's own signal drowns out any incoming signal, making it impossible to detect collisions during transmission. This is why WiFi uses Collision Avoidance instead.",
  },
  {
    question: "What is the purpose of the RTS/CTS mechanism?",
    options: [
      "To increase data rate",
      "To reduce power consumption",
      "To solve the hidden node problem",
      "To encrypt transmissions",
    ],
    correctIndex: 2,
    explanation:
      "RTS/CTS solves the hidden node problem. When Node A and Node C can't hear each other but both communicate with Node B, RTS/CTS ensures they don't transmit simultaneously.",
  },
];

export default function CSMACA() {
  return (
    <section id="csma-ca" className="scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#ff9500]/15 p-3">
            <Wifi className="text-[#ff9500]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              IEEE 802.11 DCF — CSMA/CA
            </h2>
            <p className="text-base text-foreground/70">
              Distributed Coordination Function
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground leading-relaxed max-w-2xl">
          The <strong className="text-foreground">Distributed Coordination Function (DCF)</strong> is the
          fundamental MAC protocol in IEEE 802.11. It uses <strong className="text-foreground">CSMA/CA</strong> —
          Carrier Sense Multiple Access with Collision Avoidance — to manage channel access among competing stations.
        </p>
      </motion.div>

      {/* DCF Steps */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">How DCF Works</h3>
        <div className="space-y-3">
          {dcfSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4"
            >
              <div
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: step.color }}
              />
              <div>
                <span className="font-semibold text-foreground">{step.step}</span>
                <p className="mt-1 text-[15px] text-foreground/80">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Backoff Animation */}
      <BackoffAnimation />

      {/* Hidden Node Problem */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="my-8"
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" />
          The Hidden Node Problem
        </h3>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5 mb-4">
          <p className="text-foreground leading-relaxed mb-4">
            The hidden node problem occurs when two stations (A and C) are out
            of range of each other but both within range of a common station
            (B). Since A cannot sense C&apos;s transmission, they may transmit
            simultaneously, causing a collision at B.
          </p>
          {/* Simple hidden node diagram */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-accent/[0.06]">
                <span className="text-xs font-bold text-accent">A</span>
              </div>
              <span className="mt-1 text-xs text-foreground/70">Station A</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-px w-16 bg-card-border" />
              <span className="text-[10px] text-foreground/70">in range</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-warning bg-warning/10">
                <span className="text-xs font-bold text-warning">B</span>
              </div>
              <span className="mt-1 text-xs text-foreground/70">AP</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-px w-16 bg-card-border" />
              <span className="text-[10px] text-foreground/70">in range</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-accent/[0.06]">
                <span className="text-xs font-bold text-accent">C</span>
              </div>
              <span className="mt-1 text-xs text-foreground/70">Station C</span>
            </div>
          </div>
          <p className="text-center text-xs text-error mt-2">
            A and C cannot hear each other — hidden from one another!
          </p>
        </div>
      </motion.div>

      {/* RTS/CTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield size={20} className="text-[#ff9500]" />
          RTS/CTS Mechanism
        </h3>
        <p className="mb-4 text-[15px] text-foreground/80">
          RTS/CTS (Request to Send / Clear to Send) solves the hidden node
          problem by reserving the channel before data transmission.
        </p>

        {/* RTS/CTS Sequence */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <Radio size={20} className="mx-auto text-accent" />
              <span className="text-xs text-foreground/70">Sender</span>
            </div>
            <div className="flex-1 mx-4 space-y-3">
              {rtsCtsConcepts.map((item, i) => {
                const colors = ["#38bdf8", "#4ade80", "#fbbf24", "#a78bfa"];
                const directions = ["→", "←", "→", "←"];
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg" style={{ color: colors[i] }}>
                      {directions[i]}
                    </span>
                    <div
                      className="flex-1 rounded px-3 py-1.5 text-xs"
                      style={{
                        backgroundColor: colors[i] + "15",
                        border: `1px solid ${colors[i]}40`,
                      }}
                    >
                      <span className="font-medium" style={{ color: colors[i] }}>
                        {item.title}
                      </span>
                      <span className="text-foreground/80"> — {item.desc}</span>
                    </div>
                    <span className="text-lg" style={{ color: colors[i] }}>
                      {directions[i]}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center">
              <Radio size={20} className="mx-auto text-accent" />
              <span className="text-xs text-foreground/70">Receiver</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quiz */}
      <Quiz title="Test Your Knowledge: CSMA/CA" questions={quizQuestions} />
    </section>
  );
}
