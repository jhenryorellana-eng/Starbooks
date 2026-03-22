"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Award,
  Flame,
  Trophy,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types";

interface BookProgress {
  id: string;
  current_step: number;
  step1_completed: boolean;
  step2_completed: boolean;
  step3_completed: boolean;
  step4_completed: boolean;
  step5_completed: boolean;
  step6_completed: boolean;
  step7_completed: boolean;
  exam_score: number | null;
  completed_at: string | null;
  book: {
    title: string;
    slug: string;
    cover_url: string | null;
    intelligence: { name: string; emoji: string; color: string } | null;
  } | null;
}

interface PerfilClientProps {
  profile: Profile | null;
  email: string;
  progressList: BookProgress[];
}

export function PerfilClient({ profile, email, progressList }: PerfilClientProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const completedBooks = progressList.filter((p) => p.completed_at);
  const inProgressBooks = progressList.filter((p) => !p.completed_at);

  function getCompletedStepsCount(p: BookProgress): number {
    return [
      p.step1_completed,
      p.step2_completed,
      p.step3_completed,
      p.step4_completed,
      p.step5_completed,
      p.step6_completed,
      p.step7_completed,
    ].filter(Boolean).length;
  }

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.06] border border-border-subtle flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-text-muted" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {profile?.full_name ?? "Estudiante"}
            </h1>
            <p className="text-sm text-text-muted">{email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            icon: BookOpen,
            label: "Libros completados",
            value: profile?.books_completed ?? completedBooks.length,
          },
          {
            icon: Award,
            label: "Certificados",
            value: completedBooks.length,
          },
          {
            icon: Flame,
            label: "Racha actual",
            value: `${profile?.current_streak ?? 0}d`,
          },
          {
            icon: Trophy,
            label: "Puntos",
            value: profile?.total_points ?? 0,
          },
        ].map((stat) => (
          <GlassCard key={stat.label} hover={false} className="p-4 text-center">
            <stat.icon className="h-5 w-5 text-accent-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Libros en progreso */}
      {inProgressBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 tracking-tight">
            En progreso
          </h2>
          <div className="space-y-3">
            {inProgressBooks.map((p) => {
              const completed = getCompletedStepsCount(p);
              const intelColor = p.book?.intelligence?.color ?? "#D4AF37";

              return (
                <Link key={p.id} href={`/libro/${p.book?.slug}`}>
                  <GlassCard className="p-4 flex items-center gap-4 cursor-pointer">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${intelColor}20, ${intelColor}05)`,
                      }}
                    >
                      <BookOpen className="h-5 w-5" style={{ color: intelColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {p.book?.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Paso {p.current_step} de 7
                      </p>
                      <ProgressBar
                        value={completed}
                        max={7}
                        color={intelColor}
                        className="mt-2"
                      />
                    </div>
                    <Badge color={intelColor}>
                      {p.book?.intelligence?.emoji}
                    </Badge>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Certificados */}
      {completedBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 tracking-tight">
            Certificados obtenidos
          </h2>
          <div className="space-y-3">
            {completedBooks.map((p) => (
              <GlassCard key={p.id} hover={false} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {p.book?.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    Puntaje: {p.exam_score}% &middot;{" "}
                    {p.completed_at
                      ? new Date(p.completed_at).toLocaleDateString("es-ES")
                      : ""}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Estado vacio */}
      {progressList.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted">Aun no has comenzado ningun libro</p>
          <Link href="/biblioteca">
            <Button className="mt-4">Explorar Biblioteca</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
