"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  annotations?: Record<number, string>;
}

export default function CodeBlock({
  code,
  language = "cpp",
  title,
  annotations,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-4 overflow-hidden rounded-2xl border border-card-border/60 bg-surface"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border/40 bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {title && (
            <span className="ml-2 text-sm text-foreground/70">{title}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
          lineNumberStyle={{ color: "#aeaeb2", minWidth: "2.5em" }}
          wrapLines
          lineProps={(lineNumber) => {
            const props: React.HTMLAttributes<HTMLElement> & { style: React.CSSProperties } = {
              style: { display: "block" },
            };
            if (annotations && annotations[lineNumber]) {
              props.style.backgroundColor = "rgba(0, 113, 227, 0.06)";
              props.style.borderLeft = "3px solid #0071e3";
              props.style.paddingLeft = "0.5rem";
            }
            return props;
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Annotation tooltips */}
        {annotations && (
          <div className="border-t border-card-border/40 bg-accent/[0.03] px-4 py-3">
            {Object.entries(annotations).map(([line, text]) => (
              <div key={line} className="flex items-start gap-2 py-1 text-xs">
                <span className="mt-0.5 rounded-md bg-accent/10 px-1.5 py-0.5 font-mono text-accent font-medium">
                  L{line}
                </span>
                <span className="text-foreground/80">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
