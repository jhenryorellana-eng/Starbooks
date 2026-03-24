import { createClient } from "@/lib/supabase/server";
import { InicioClient } from "./InicioClient";
import type { Book } from "@/types";

export const metadata = {
  title: "Starbooks — Las 7 Inteligencias",
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredBook } = await supabase
    .from("books")
    .select("*, author:authors(*), intelligence:intelligences(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(1)
    .single();

  const { data: allBooks } = await supabase
    .from("books")
    .select("*, author:authors(*), intelligence:intelligences(*)")
    .order("sort_order");

  return (
    <InicioClient
      featuredBook={featuredBook as Book | null}
      allBooks={(allBooks as Book[]) || []}
    />
  );
}
