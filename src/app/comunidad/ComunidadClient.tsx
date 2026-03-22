"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Flame,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Zap,
  User,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface RankUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  books_completed: number;
  current_streak: number;
}

interface Props {
  rankings: RankUser[];
  examScores: Record<string, { avg: number; count: number }>;
  currentUserId: string | null;
}

const PODIUM_COLORS = {
  1: { bg: "from-amber-500/20 to-yellow-600/10", border: "#D4AF37", badge: "bg-gradient-to-r from-amber-400 to-yellow-500", shadow: "shadow-amber-500/20" },
  2: { bg: "from-blue-400/15 to-blue-500/5", border: "#60A5FA", badge: "bg-gradient-to-r from-blue-400 to-blue-500", shadow: "shadow-blue-500/15" },
  3: { bg: "from-orange-400/15 to-orange-500/5", border: "#FB923C", badge: "bg-gradient-to-r from-orange-400 to-orange-500", shadow: "shadow-orange-500/15" },
};

function getRankTitle(points: number): string {
  if (points >= 5000) return "Leyenda";
  if (points >= 3000) return "Maestro";
  if (points >= 1500) return "Experto";
  if (points >= 500) return "Explorador";
  if (points >= 100) return "Aprendiz";
  return "Novato";
}

function getNextMilestone(points: number): { title: string; target: number } {
  if (points < 100) return { title: "Aprendiz", target: 100 };
  if (points < 500) return { title: "Explorador", target: 500 };
  if (points < 1500) return { title: "Experto", target: 1500 };
  if (points < 3000) return { title: "Maestro", target: 3000 };
  if (points < 5000) return { title: "Leyenda", target: 5000 };
  return { title: "Leyenda Maxima", target: 10000 };
}

export function ComunidadClient({ rankings, examScores, currentUserId }: Props) {
  const currentUser = rankings.find((r) => r.id === currentUserId);
  const currentUserRank = rankings.findIndex((r) => r.id === currentUserId) + 1;
  const top3 = rankings.slice(0, 3);
  const restRankings = rankings.slice(3);

  const milestone = currentUser
    ? getNextMilestone(currentUser.total_points)
    : { title: "Aprendiz", target: 100 };
  const currentPoints = currentUser?.total_points ?? 0;
  const progressPercent = Math.min(
    Math.round((currentPoints / milestone.target) * 100),
    100
  );

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-12 px-4 sm:px-6 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
          Comunidad
        </h1>
        <p className="text-text-secondary text-[17px] font-normal mt-2">
          Ranking global de estudiantes Starbooks
        </p>
      </motion.div>

      {/* Milestone Card (solo si esta logueado) */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-success/5 border border-accent-primary/20 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center">
              <Star className="h-7 w-7 text-accent-primary" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary text-lg">
                Proximo Hito
              </h2>
              <p className="text-sm text-text-secondary">
                Estas a{" "}
                <span className="text-accent-primary font-bold">
                  {milestone.target - currentPoints} pts
                </span>{" "}
                de{" "}
                <span className="text-accent-primary font-bold">
                  {milestone.title}
                </span>
              </p>
            </div>
          </div>
          <div className="relative w-full h-3 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-primary to-[#00B4D8]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-y-0 left-0 w-full h-1 bg-white/10 rounded-full" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted font-medium">
            <span>{currentPoints} pts</span>
            <span>{milestone.target} pts</span>
          </div>
        </motion.div>
      )}

      {/* Podium Top 3 */}
      {top3.length >= 3 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-end justify-center gap-3 pt-8 pb-4"
          style={{ minHeight: 360 }}
        >
          {/* 2do lugar */}
          <PodiumCard user={top3[1]} rank={2} examScores={examScores} isCurrentUser={top3[1].id === currentUserId} />
          {/* 1er lugar */}
          <PodiumCard user={top3[0]} rank={1} examScores={examScores} isCurrentUser={top3[0].id === currentUserId} />
          {/* 3er lugar */}
          <PodiumCard user={top3[2]} rank={3} examScores={examScores} isCurrentUser={top3[2].id === currentUserId} />
        </motion.section>
      )}

      {/* Ranking List */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary tracking-tight">
          Ranking Global
        </h3>
        <div className="space-y-2">
          {restRankings.map((user, i) => {
            const rank = i + 4;
            const isMe = user.id === currentUserId;
            const score = examScores[user.id];

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  isMe
                    ? "bg-accent-primary/10 border-accent-primary/30 shadow-lg shadow-accent-primary/10"
                    : "bg-white/[0.03] border-border-subtle hover:bg-white/[0.05]"
                )}
              >
                <span
                  className={cn(
                    "w-8 text-center font-bold text-lg",
                    isMe ? "text-accent-primary" : "text-text-muted"
                  )}
                >
                  {rank}
                </span>

                <div
                  className={cn(
                    "h-11 w-11 rounded-full overflow-hidden flex items-center justify-center shrink-0",
                    isMe
                      ? "border-2 border-accent-primary bg-accent-primary/10"
                      : "bg-white/[0.06]"
                  )}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-text-muted" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-semibold text-sm truncate",
                        isMe ? "text-accent-primary" : "text-text-primary"
                      )}
                    >
                      {isMe ? "Tu" : user.full_name ?? "Estudiante"}
                    </p>
                    {isMe && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary uppercase tracking-wider">
                        {getRankTitle(user.total_points)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">
                    {user.total_points} pts
                    {user.books_completed > 0 &&
                      ` · ${user.books_completed} libros`}
                    {score && ` · Promedio: ${score.avg}%`}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {user.current_streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-orange-400 font-bold">
                      <Flame className="h-3.5 w-3.5" />
                      {user.current_streak}
                    </span>
                  )}
                  {isMe && <TrendingUp className="h-4 w-4 text-accent-primary" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {rankings.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">
              Aun no hay estudiantes en el ranking
            </p>
            <Link href="/biblioteca">
              <Button className="mt-4">Comienza a aprender</Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-4"
      >
        <Link href="/biblioteca">
          <button className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-accent-primary to-[#00B4D8] text-bg-primary hover:brightness-110 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-accent-primary/20">
            <BookOpen className="h-5 w-5" />
            Seguir Leyendo
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

// Componente del podio
function PodiumCard({
  user,
  rank,
  examScores,
  isCurrentUser,
}: {
  user: RankUser;
  rank: 1 | 2 | 3;
  examScores: Record<string, { avg: number; count: number }>;
  isCurrentUser: boolean;
}) {
  const colors = PODIUM_COLORS[rank];
  const score = examScores[user.id];
  const isFirst = rank === 1;
  const podiumHeight = rank === 1 ? "h-52" : rank === 2 ? "h-36" : "h-28";

  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center",
        isFirst && "scale-110 z-10"
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + rank * 0.1, type: "spring" }}
        className="relative mb-3"
      >
        {isFirst && (
          <Crown
            className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-6 text-amber-400"
            fill="currentColor"
          />
        )}
        <div
          className={cn(
            "rounded-full overflow-hidden border-[3px] flex items-center justify-center",
            isFirst ? "w-20 h-20" : "w-16 h-16",
            isCurrentUser ? "ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary" : ""
          )}
          style={{ borderColor: colors.border }}
        >
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.border}15` }}
            >
              <User
                className={isFirst ? "h-8 w-8" : "h-6 w-6"}
                style={{ color: colors.border }}
              />
            </div>
          )}
        </div>
        {/* Badge numero */}
        <div
          className={cn(
            "absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-white text-xs font-black rounded-full border-2 border-bg-primary flex items-center justify-center",
            colors.badge,
            isFirst ? "w-7 h-7" : "w-6 h-6"
          )}
        >
          {rank}
        </div>
      </motion.div>

      {/* Pedestal */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ delay: 0.3 + rank * 0.1 }}
        className={cn(
          "w-full rounded-t-2xl flex flex-col items-center pt-4 pb-3 bg-gradient-to-t",
          colors.bg,
          podiumHeight,
          `border border-b-0`,
          colors.shadow,
          "shadow-lg"
        )}
        style={{ borderColor: `${colors.border}30` }}
      >
        <p
          className={cn(
            "font-bold text-center leading-tight px-2 truncate w-full",
            isFirst ? "text-sm" : "text-xs"
          )}
          style={{ color: colors.border }}
        >
          {isCurrentUser ? "Tu" : user.full_name ?? "Estudiante"}
        </p>

        <div className="mt-2 flex flex-col items-center gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
            Puntos
          </span>
          <span
            className={cn("font-black", isFirst ? "text-xl" : "text-lg")}
            style={{ color: colors.border }}
          >
            {user.total_points.toLocaleString()}
          </span>
        </div>

        {user.books_completed > 0 && isFirst && (
          <div
            className="mt-2 px-3 py-1 rounded-full flex items-center gap-1"
            style={{ backgroundColor: `${colors.border}15` }}
          >
            <BookOpen className="h-3 w-3" style={{ color: colors.border }} />
            <span
              className="text-[10px] font-bold"
              style={{ color: colors.border }}
            >
              {user.books_completed} libros
            </span>
          </div>
        )}

        {score && (
          <span className="text-[10px] text-text-muted mt-1">
            Promedio: {score.avg}%
          </span>
        )}
      </motion.div>
    </div>
  );
}
