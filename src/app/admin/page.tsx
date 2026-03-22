import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Users, Brain, FileQuestion } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [books, authors, intelligences, questions] = await Promise.all([
    supabase.from("books").select("id", { count: "exact", head: true }),
    supabase.from("authors").select("id", { count: "exact", head: true }),
    supabase.from("intelligences").select("id", { count: "exact", head: true }),
    supabase.from("step7_questions").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Libros", count: books.count ?? 0, icon: BookOpen, href: "/admin/libros", color: "#D4AF37" },
    { label: "Autores", count: authors.count ?? 0, icon: Users, href: "/admin/autores", color: "#6C63FF" },
    { label: "Inteligencias", count: intelligences.count ?? 0, icon: Brain, href: "/admin/inteligencias", color: "#10B981" },
    { label: "Preguntas", count: questions.count ?? 0, icon: FileQuestion, href: "/admin/libros", color: "#F59E0B" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Vista general del contenido
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <GlassCard className="p-5 cursor-pointer">
              <stat.icon className="h-6 w-6 mb-3" style={{ color: stat.color }} />
              <p className="text-2xl font-bold text-text-primary">{stat.count}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
