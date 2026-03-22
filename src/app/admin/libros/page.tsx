import { createClient } from "@/lib/supabase/server";
import { LibrosClient } from "./LibrosClient";

export const metadata = { title: "Libros" };

export default async function LibrosPage() {
  const supabase = await createClient();
  const { data: books } = await supabase
    .from("books")
    .select("*, author:authors(name), intelligence:intelligences(name, emoji, color)")
    .order("sort_order");

  return <LibrosClient books={books ?? []} />;
}
