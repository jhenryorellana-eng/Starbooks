"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import type { Step7Exam, Step7Question, QuestionOption } from "@/types";
import { CertificatePreview } from "./CertificatePreview";

interface ExamViewProps {
  exam: Step7Exam;
  questions: Step7Question[];
  bookTitle: string;
  bookSlug: string;
  bookId: string;
  userName: string;
  previousScore: number | null;
  attempts: number;
  onComplete: (score: number, passed: boolean) => Promise<void>;
}

type ExamPhase = "intro" | "exam" | "results";

export function ExamView({
  exam,
  questions,
  bookTitle,
  bookSlug,
  bookId,
  userName,
  previousScore,
  attempts,
  onComplete,
}: ExamViewProps) {
  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function selectAnswer(questionIndex: number, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  }

  async function handleFinish() {
    setSubmitting(true);

    let correct = 0;
    questions.forEach((q, i) => {
      const selected = answers[i];
      const correctOption = q.options.find((o) => o.is_correct);
      if (selected === correctOption?.id) correct++;
    });

    const finalScore = Math.round((correct / questions.length) * 100);
    const hasPassed = finalScore >= exam.passing_score;

    setScore(finalScore);
    setPassed(hasPassed);
    await onComplete(finalScore, hasPassed);
    setPhase("results");
    setSubmitting(false);
  }

  function restart() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setScore(0);
    setPassed(false);
  }

  // INTRO
  if (phase === "intro") {
    return (
      <GlassCard hover={false} className="p-8 text-center space-y-6">
        <Trophy className="h-16 w-16 text-accent-primary mx-auto" />
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          {exam.title}
        </h2>
        {exam.description && (
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            {exam.description}
          </p>
        )}
        <div className="flex justify-center gap-6 text-sm text-text-muted">
          <span>{questions.length} preguntas</span>
          <span>Minimo: {exam.passing_score}%</span>
          {attempts > 0 && <span>{attempts} intentos previos</span>}
        </div>
        {previousScore !== null && (
          <p className="text-sm text-text-muted">
            Ultimo puntaje: <span className="text-accent-primary font-semibold">{previousScore}%</span>
          </p>
        )}
        <Button size="lg" onClick={() => setPhase("exam")}>
          Comenzar Examen
        </Button>
      </GlassCard>
    );
  }

  // RESULTS
  if (phase === "results") {
    return (
      <div className="space-y-8">
        <GlassCard hover={false} className="p-8 text-center space-y-4">
          {passed ? (
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-400 mx-auto" />
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={cn(
              "text-5xl font-bold",
              passed ? "text-emerald-400" : "text-red-400"
            )}
          >
            {score}%
          </motion.div>

          <h2 className="text-xl font-bold text-text-primary">
            {passed ? "Aprobado!" : "No aprobado"}
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            {passed
              ? "Felicitaciones! Has demostrado tu dominio del contenido."
              : "No te preocupes, puedes intentarlo de nuevo. Revisa los capitulos donde tuviste dificultades."}
          </p>

          {!passed && (
            <Button variant="secondary" onClick={restart}>
              <RotateCcw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          )}
        </GlassCard>

        {/* Resumen de respuestas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Resumen de respuestas
          </h3>
          {questions.map((q, i) => {
            const selected = answers[i];
            const correctOption = q.options.find((o) => o.is_correct);
            const isCorrect = selected === correctOption?.id;

            return (
              <GlassCard key={q.id} hover={false} className="p-4 space-y-2">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  )}
                  <p className="text-sm text-text-primary">{q.question_text}</p>
                </div>
                {!isCorrect && q.explanation && (
                  <p className="text-xs text-text-muted ml-6">
                    {q.explanation}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Certificado */}
        {passed && (
          <CertificatePreview
            studentName={userName}
            bookTitle={bookTitle}
            score={score}
            date={new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        )}
      </div>
    );
  }

  // EXAM
  const question = questions[currentQ];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          Pregunta {currentQ + 1} de {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                i === currentQ
                  ? "bg-accent-primary"
                  : answers[i]
                    ? "bg-accent-primary/30"
                    : "bg-white/[0.08]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium text-text-primary leading-relaxed">
            {question.question_text}
          </h3>

          <div className="grid gap-3">
            {question.options.map((option: QuestionOption) => (
              <button
                key={option.id}
                onClick={() => selectAnswer(currentQ, option.id)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer",
                  answers[currentQ] === option.id
                    ? "bg-accent-primary/15 border-accent-primary/40 text-text-primary"
                    : "bg-white/[0.03] border-border-subtle text-text-secondary hover:bg-white/[0.06] hover:border-border-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      answers[currentQ] === option.id
                        ? "border-accent-primary bg-accent-primary"
                        : "border-white/[0.2]"
                    )}
                  >
                    {answers[currentQ] === option.id && (
                      <div className="h-2 w-2 rounded-full bg-bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentQ((c) => c - 1)}
          disabled={currentQ === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentQ < questions.length - 1 ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentQ((c) => c + 1)}
            disabled={!answers[currentQ]}
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            isLoading={submitting}
            disabled={Object.keys(answers).length < questions.length}
          >
            Finalizar Examen
          </Button>
        )}
      </div>
    </div>
  );
}
