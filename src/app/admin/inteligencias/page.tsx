import { createClient } from "@/lib/supabase/server";
import { InteligenciasClient } from "./InteligenciasClient";

export const metadata = { title: "Inteligencias" };

export default async function InteligenciasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("intelligences").select("*").order("sort_order");
  return <InteligenciasClient intelligences={data ?? []} />;
}
