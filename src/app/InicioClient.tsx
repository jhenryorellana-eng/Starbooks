"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Lock,
  Headphones,
  Map,
  Clapperboard,
  Mic,
  MessageCircle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { STEPS } from "@/lib/constants";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const STARTER_BOOKS = [
  {
    title: "Padre Rico, Padre Pobre",
    author: "Robert Kiyosaki",
    duration: "4h 30m",
    chapters: 9,
    rating: 4.8,
    slug: "padre-rico-padre-pobre",
    color: "#D4AF37",
    intelligence: "Financiera",
    emoji: "💰",
    available: true,
    description: "Descubre por que los ricos no trabajan por dinero y como puedes construir tu libertad financiera desde joven.",
  },
  {
    title: "Los 7 Habitos de los Adolescentes",
    author: "Sean Covey",
    duration: "12h 45m",
    chapters: 0,
    rating: 4.8,
    slug: "7-habitos-adolescentes",
    color: "#6C63FF",
    intelligence: "Mental",
    emoji: "🧠",
    available: false,
    description: "Habitos poderosos que transformaran tu vida personal y academica.",
  },
  {
    title: "Las 6 Decisiones mas Importantes",
    author: "Sean Covey",
    duration: "8h 30m",
    chapters: 0,
    rating: 4.7,
    slug: "6-decisiones",
    color: "#10B981",
    intelligence: "Social",
    emoji: "🤝",
    available: false,
    description: "Las decisiones que definen tu futuro como adolescente.",
  },
  {
    title: "La Jornada Laboral de 4 Horas",
    author: "Tim Ferriss",
    duration: "7h 15m",
    chapters: 0,
    rating: 4.5,
    slug: "jornada-4-horas",
    color: "#F97316",
    intelligence: "Negocios",
    emoji: "💼",
    available: false,
    description: "Automatiza tu vida y construye un negocio desde cualquier lugar.",
  },
];

const STEP_ICONS = [Headphones, BookOpen, Map, Clapperboard, Mic, MessageCircle, Trophy];

const INTELLIGENCES_DATA = [
  { name: "Mental", emoji: "🧠", color: "#6C63FF", bookCount: 4, totalHours: "19h" },
  { name: "Emocional", emoji: "❤️", color: "#FF6B6B", bookCount: 4, totalHours: "26h" },
  { name: "Financiera", emoji: "💰", color: "#D4AF37", bookCount: 4, totalHours: "20h" },
  { name: "Negocios", emoji: "💼", color: "#F59E0B", bookCount: 4, totalHours: "25h" },
  { name: "Fisica", emoji: "💪", color: "#F97316", bookCount: 4, totalHours: "18h" },
  { name: "Espiritual", emoji: "🌟", color: "#A78BFA", bookCount: 4, totalHours: "26h" },
  { name: "Social", emoji: "🤝", color: "#10B981", bookCount: 4, totalHours: "18h" },
];

export function InicioClient() {
  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-12">
      {/* ===== HERO ===== */}
      <section className="relative px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16 sm:py-24 lg:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent-primary/10 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-1/3 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-[#00B4D8]/8 rounded-full blur-[60px] sm:blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-[80px]" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative space-y-6">
          <motion.div variants={fadeUp}>
            <Badge color="#7C5CFC" className="mb-2">
              <Sparkles className="h-3 w-3" />
              Plataforma Educativa
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.05]">
            Aprende de los mejores{" "}
            <span className="bg-gradient-to-r from-accent-primary to-[#00B4D8] bg-clip-text text-transparent">
              libros del mundo
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Starbooks transforma cada libro en una experiencia de{" "}
            <span className="text-text-primary font-medium">7 pasos interactivos</span>:{" "}
            audio, video, mapas conceptuales, chatbot IA y mas.
            Disenado para jovenes emprendedores de 10 a 17 anos.
          </motion.p>

          <motion.div variants={fadeUp} className="pt-4">
            <Link href="/libro/padre-rico-padre-pobre">
              <Button size="lg" className="text-base px-8">
                <BookOpen className="h-5 w-5" />
                Empezar con Padre Rico, Padre Pobre
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== COMO FUNCIONA (7 PASOS) ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Como funciona Starbooks
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              Cada libro tiene 7 pasos disenados para que aprendas de forma profunda y practica
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STEPS.map((step, i) => {
              const StepIcon = STEP_ICONS[i];
              return (
                <motion.div
                  key={step.number}
                  variants={scaleIn}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-border-subtle hover:border-accent-primary/30 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <StepIcon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-accent-primary">Paso {step.number}</span>
                  <span className="text-[11px] text-text-secondary text-center leading-tight font-medium">
                    {step.shortTitle}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ===== LIBRO DISPONIBLE ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <Badge color="#D4AF37" className="mb-3">
              <BookOpen className="h-3 w-3" />
              Disponible ahora
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              Tu primer libro te espera
            </h2>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/libro/padre-rico-padre-pobre">
              <div className="relative rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/8 via-transparent to-[#D4AF37]/5 p-6 sm:p-8 hover:border-[#D4AF37]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-24 h-32 sm:w-32 sm:h-44 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <BookOpen className="h-10 w-10 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <Badge color="#D4AF37" className="mb-2">
                      💰 Inteligencia Financiera
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 group-hover:text-[#D4AF37] transition-colors">
                      Padre Rico, Padre Pobre
                    </h3>
                    <p className="text-sm text-text-muted mb-1">por Robert Kiyosaki</p>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-lg">
                      Descubre por que los ricos no trabajan por dinero y como puedes construir tu libertad financiera desde joven.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 4h 30min</span>
                      <span className="flex items-center gap-1"><Clapperboard className="h-3.5 w-3.5" /> 9 capitulos</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-[#D4AF37]" fill="currentColor" /> 4.8</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Chatbot IA</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary to-[#00B4D8] text-bg-primary text-sm font-semibold group-hover:brightness-110 transition-all">
                      Comenzar ahora <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== PROXIMAMENTE (LIBROS BLOQUEADOS) ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <Badge color="#5A6178" className="mb-3">
              <Lock className="h-3 w-3" />
              Proximamente
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              Mas libros en camino
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              Estos libros estaran disponibles muy pronto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STARTER_BOOKS.filter((b) => !b.available).map((book) => (
              <motion.div key={book.title} variants={fadeUp}>
                <div className="relative rounded-2xl border border-border-subtle p-5 bg-white/[0.02] overflow-hidden">
                  <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                        <Lock className="h-5 w-5 text-text-muted" />
                      </div>
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Proximamente</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="h-14 w-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${book.color}15` }}
                    >
                      <BookOpen className="h-5 w-5" style={{ color: book.color }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${book.color}15`, color: book.color }}>
                        {book.emoji} {book.intelligence}
                      </span>
                      <h3 className="text-sm font-semibold text-text-primary mt-1 line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{book.author}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== PLAN DE ESTUDIO (7 INTELIGENCIAS - BLOQUEADAS) ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Plan de Estudio Sistematizado
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              7 inteligencias. Un plan estructurado para dominar las habilidades del futuro.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {INTELLIGENCES_DATA.map((intel) => (
              <motion.div key={intel.name} variants={scaleIn}>
                <div className="relative rounded-2xl border border-border-subtle p-4 overflow-hidden bg-white/[0.02]">
                  <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${intel.color}12` }}
                    >
                      {intel.emoji}
                    </div>
                    <h3 className="text-xs font-bold text-text-primary">{intel.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      <span>{intel.bookCount} libros</span>
                      <span>{intel.totalHours}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Empieza tu viaje ahora
          </h2>
          <p className="text-text-secondary text-sm">
            Tu primer libro esta listo. 9 capitulos, chatbot con IA, y un certificado al final.
          </p>
          <Link href="/libro/padre-rico-padre-pobre">
            <Button size="lg">
              <BookOpen className="h-4 w-4" />
              Comenzar Padre Rico, Padre Pobre
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
