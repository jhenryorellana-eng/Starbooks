"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

interface CompleteStepButtonProps {
  bookId: string;
  bookSlug: string;
  stepNumber: number;
  isCompleted: boolean;
}

export function CompleteStepButton({
  bookId,
  bookSlug,
  stepNumber,
  isCompleted,
}: CompleteStepButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const stepKey = `step${stepNumber}_completed`;
      const nextStep = Math.min(stepNumber + 1, 7);

      const { data: existing } = await supabase
        .from("user_book_progress")
        .select("id, current_step")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .single();

      if (existing) {
        const { error: updateError } = await supabase
          .from("user_book_progress")
          .update({
            [stepKey]: true,
            current_step: Math.max(existing.current_step, nextStep),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("user_book_progress")
          .insert({
            user_id: user.id,
            book_id: bookId,
            [stepKey]: true,
            current_step: nextStep,
          });

        if (insertError) throw insertError;
      }

      if (stepNumber < 7) {
        router.push(`/libro/${bookSlug}/paso-${nextStep}`);
      }
      router.refresh();
    } catch (err) {
      setError("No se pudo completar el paso. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-4 mt-8">
        <div className="flex items-center gap-2 text-accent-primary text-sm">
          <Check className="h-4 w-4" />
          Paso completado
        </div>
        {stepNumber < 7 && (
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/libro/${bookSlug}/paso-${stepNumber + 1}`)
            }
          >
            Siguiente paso
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-2">
      <Button onClick={handleComplete} isLoading={loading} size="lg">
        <Check className="h-4 w-4" />
        Completar Paso {stepNumber}
      </Button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
