"use client";
import { motion } from "framer-motion";

interface NodeInfo {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

interface LinkInfo {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
}

interface NetworkDiagramProps {
  nodes: NodeInfo[];
  links: LinkInfo[];
  title?: string;
  width?: number;
  height?: number;
}

export default function NetworkDiagram({
  nodes,
  links,
  title,
  width = 600,
  height = 300,
}: NetworkDiagramProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
    >
      {title && (
        <div className="border-b border-card-border/40 bg-surface px-4 py-2">
          <span className="text-sm font-medium text-accent">{title}</span>
        </div>
      )}
      <div className="flex items-center justify-center p-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-2xl"
          style={{ maxHeight: height }}
        >
          {links.map((link, i) => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (!source || !target) return null;
            return (
              <g key={`link-${i}`}>
                <motion.line
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke="#d2d2d7"
                  strokeWidth={2}
                  strokeDasharray={link.dashed ? "6,4" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                />
                {link.label && (
                  <motion.text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 8}
                    textAnchor="middle"
                    fill="#3a3a3c"
                    fontSize={11}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {link.label}
                  </motion.text>
                )}
              </g>
            );
          })}

          {nodes.map((node, i) => (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }}
            >
              <circle
                cx={node.x} cy={node.y} r={24}
                fill={node.color || "#f5f5f7"}
                stroke={node.color || "#0071e3"}
                strokeWidth={2}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle"
                fill="#1d1d1f"
                fontSize={13}
                fontWeight="600"
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
