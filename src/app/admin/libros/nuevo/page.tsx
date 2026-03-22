import { createClient } from "@/lib/supabase/server";
import { BookFormClient } from "../BookFormClient";

export const metadata = { title: "Nuevo libro" };

export default async function NuevoLibroPage() {
  const supabase = await createClient();
  const [{ data: authors }, { data: intelligences }] = await Promise.all([
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("intelligences").select("id, name, emoji").order("sort_order"),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-6">
        Nuevo libro
      </h1>
      <BookFormClient
        authors={authors ?? []}
        intelligences={intelligences ?? []}
      />
    </div>
  );
}
