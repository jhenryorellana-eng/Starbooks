import { createClient } from "@/lib/supabase/server";
import { BibliotecaClient } from "./BibliotecaClient";

export const metadata = {
  title: "Biblioteca",
};

export default async function BibliotecaPage() {
  const supabase = await createClient();

  const [{ data: books }, { data: intelligences }] = await Promise.all([
    supabase
      .from("books")
      .select("*, author:authors(*), intelligence:intelligences(*)")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("intelligences").select("*").order("sort_order"),
  ]);

  return (
    <BibliotecaClient
      books={books ?? []}
      intelligences={intelligences ?? []}
    />
  );
}
