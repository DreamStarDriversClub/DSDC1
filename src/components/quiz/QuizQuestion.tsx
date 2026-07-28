"use client";

import { cn } from "@/lib/utils";
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onSelect: (answerId: string) => void;
  direction: "enter" | "exit";
}

export function QuizQuestion({ question, onSelect, direction }: QuizQuestionProps) {
  return (
    <div
      className={cn(
        "w-full animate-fade-in-up",
        direction === "exit" && "animate-slide-out-right"
      )}
    >
      {/* Question */}
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
          {question.question}
        </h2>
        <p className="mt-3 text-base text-ds-gray-400">{question.subtitle}</p>
      </div>

      {/* Answer cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {question.answers.map((answer, idx) => (
          <button
            key={answer.id}
            onClick={() => onSelect(answer.id)}
            className={cn(
              "group relative flex flex-col items-center rounded-2xl border border-white/[0.08] bg-ds-black-charcoal p-6 text-left transition-all duration-300",
              "hover:border-ds-red/40 hover:bg-ds-black-darkgray hover:shadow-brand-glow-sm",
              "focus:outline-none focus:ring-2 focus:ring-ds-red/40",
              "animate-fade-in-up"
            )}
            style={{
              animationDelay: `${idx * 100}ms`,
              animationFillMode: "backwards",
            }}
          >
            {/* Emoji */}
            <span className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
              {answer.emoji}
            </span>

            {/* Label */}
            <span className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
              {answer.label}
            </span>

            {/* Description */}
            <span className="mt-1.5 text-center text-sm leading-relaxed text-ds-gray-400">
              {answer.description}
            </span>

            {/* Hover indicator — subtle bottom border accent */}
            <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-ds-red/0 to-transparent transition-all duration-300 group-hover:via-ds-red/40" />
          </button>
        ))}
      </div>
    </div>
  );
}
