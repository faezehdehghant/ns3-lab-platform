"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
}

export default function Quiz({ title, questions }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQ];
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border/40 bg-surface px-5 py-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-accent" size={20} />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <span className="text-base text-foreground/70">
          {currentQ + 1}/{questions.length}
        </span>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-5xl font-bold text-accent mb-2">
                {score}/{questions.length}
              </div>
              <p className="text-foreground/80 mb-4">
                {score === questions.length
                  ? "Perfect score! Excellent understanding!"
                  : score >= questions.length / 2
                  ? "Good job! Review the topics you missed."
                  : "Keep studying! Review the material and try again."}
              </p>
              <button
                onClick={handleReset}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="mb-4 text-lg font-semibold text-foreground">
                {question.question}
              </p>

              <div className="space-y-2">
                {question.options.map((option, i) => {
                  let borderClass = "ring-1 ring-black/[0.08] hover:ring-accent/40";
                  let bgClass = "bg-white hover:bg-accent/[0.03]";

                  if (showResult) {
                    if (i === question.correctIndex) {
                      borderClass = "ring-2 ring-success";
                      bgClass = "bg-success/5";
                    } else if (i === selectedAnswer && !isCorrect) {
                      borderClass = "ring-2 ring-error";
                      bgClass = "bg-error/5";
                    } else {
                      borderClass = "ring-1 ring-black/[0.04] opacity-50";
                      bgClass = "bg-white";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={showResult}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all ${borderClass} ${bgClass}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-foreground">{option}</span>
                      {showResult && i === question.correctIndex && (
                        <CheckCircle className="ml-auto text-success" size={18} />
                      )}
                      {showResult && i === selectedAnswer && !isCorrect && i !== question.correctIndex && (
                        <XCircle className="ml-auto text-error" size={18} />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <div
                      className={`rounded-xl px-4 py-3 text-sm ${
                        isCorrect
                          ? "bg-success/5 ring-1 ring-success/20"
                          : "bg-error/5 ring-1 ring-error/20"
                      }`}
                    >
                      <p className={`font-medium ${isCorrect ? "text-success" : "text-error"}`}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      <p className="mt-1 text-foreground/80">{question.explanation}</p>
                    </div>
                    <button
                      onClick={handleNext}
                      className="mt-3 flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                    >
                      {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQ + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
