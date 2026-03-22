import { createClient } from "@/lib/supabase/server";
import { ComunidadClient } from "./ComunidadClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidad",
};

export default async function ComunidadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Obtener ranking ordenado por puntos y libros completados
  const { data: rankings } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, total_points, books_completed, current_streak")
    .order("total_points", { ascending: false })
    .order("books_completed", { ascending: false })
    .limit(50);

  // Obtener progreso de examenes para calcular promedio de notas
  let examScores: Record<string, { avg: number; count: number }> = {};
  if (rankings && rankings.length > 0) {
    const { data: progress } = await supabase
      .from("user_book_progress")
      .select("user_id, exam_score")
      .not("exam_score", "is", null);

    if (progress) {
      for (const p of progress) {
        if (!examScores[p.user_id]) {
          examScores[p.user_id] = { avg: 0, count: 0 };
        }
        examScores[p.user_id].count++;
        examScores[p.user_id].avg += p.exam_score ?? 0;
      }
      for (const uid of Object.keys(examScores)) {
        examScores[uid].avg = Math.round(examScores[uid].avg / examScores[uid].count);
      }
    }
  }

  return (
    <ComunidadClient
      rankings={rankings ?? []}
      examScores={examScores}
      currentUserId={user?.id ?? null}
    />
  );
}
