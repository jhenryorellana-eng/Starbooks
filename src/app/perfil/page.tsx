import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PerfilClient } from "./PerfilClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil",
};

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: progressList } = await supabase
    .from("user_book_progress")
    .select("*, book:books(title, slug, cover_url, intelligence:intelligences(name, emoji, color))")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <PerfilClient
      profile={profile}
      email={user.email ?? ""}
      progressList={progressList ?? []}
    />
  );
}
