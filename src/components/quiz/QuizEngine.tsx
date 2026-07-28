"use client";

import { useState, useCallback, useEffect } from "react";
import { QUIZ_QUESTIONS, computeResult, type QuizArchetype } from "@/lib/quiz-data";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";

interface RecProduct {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

interface QuizEngineProps {
  /** Initial products fetched server-side for recommendations */
  products: RecProduct[];
}

export function QuizEngine({ products }: QuizEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState<"enter" | "exit">("enter");
  const [result, setResult] = useState<QuizArchetype | null>(null);
  const [animating, setAnimating] = useState(false);

  const totalSteps = QUIZ_QUESTIONS.length;

  const handleSelect = useCallback(
    (answerId: string) => {
      if (animating) return;
      setAnimating(true);

      const newAnswers = [...answers, answerId];
      setAnswers(newAnswers);

      // Start exit animation
      setDirection("exit");

      // After exit animation, move to next step or show result
      setTimeout(() => {
        if (currentStep + 1 >= totalSteps) {
          // Compute result
          const archetype = computeResult(newAnswers);
          setResult(archetype);
          setCurrentStep((s) => s + 1);
          setDirection("enter");
          setAnimating(false);
        } else {
          setCurrentStep((s) => s + 1);
          setDirection("enter");
          setAnimating(false);
        }
      }, 250); // match CSS transition timing
    },
    [answers, currentStep, animating, totalSteps]
  );

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
    setDirection("enter");
    setAnimating(false);
  }, []);

  // Progress percentage
  const progress = result ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* ── Step Indicator ────────────────────────────────── */}
      {!result && (
        <div className="mb-10">
          {/* Progress bar */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ds-gray-500">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs font-semibold text-ds-red">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Dots + bar */}
          <div className="relative flex items-center gap-2">
            {/* Background track */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-white/[0.06]" />
            {/* Progress fill */}
            <div
              className="absolute inset-y-0 left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-ds-red transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />

            {/* Step dots */}
            {QUIZ_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className="relative z-10 flex-1"
              >
                <div
                  className={`mx-auto h-3 w-3 rounded-full border-2 transition-all duration-400 ${
                    idx < currentStep
                      ? "border-ds-red bg-ds-red"
                      : idx === currentStep
                      ? "border-ds-red bg-ds-black"
                      : "border-white/[0.15] bg-ds-black-charcoal"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {result ? (
          <QuizResults
            archetype={result}
            products={products.filter((p) =>
              result.recommendedCategories.some((cat) => {
                // Match category slug
                const pCat = p.category.toLowerCase();
                const rCat = cat.toLowerCase();
                if (pCat === rCat || pCat.includes(rCat) || rCat.includes(pCat)) return true;
                // ds-performance → performance mapping
                if (rCat === "ds-performance" && (pCat === "performance" || pCat === "ds-performance")) return true;
                return false;
              })
            )}
          />
        ) : (
          <QuizQuestion
            key={currentStep}
            question={QUIZ_QUESTIONS[currentStep]}
            onSelect={handleSelect}
            direction={direction}
          />
        )}
      </div>
    </div>
  );
}
