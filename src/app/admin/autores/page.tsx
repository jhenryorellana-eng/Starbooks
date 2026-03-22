import { createClient } from "@/lib/supabase/server";
import { AutoresClient } from "./AutoresClient";

export const metadata = { title: "Autores" };

export default async function AutoresPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .order("name");

  return <AutoresClient authors={authors ?? []} />;
}
