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
  Infinity,
  Rocket,
  Gift,
  CheckCircle,
  Play,
} from "lucide-react";
import Link from "next/link";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STARTER_BOOKS = [
  {
    title: "Los 7 Habitos de los Adolescentes Altamente Efectivos",
    author: "Sean Covey",
    duration: "12h 45m",
    rating: 4.8,
    slug: "7-habitos-adolescentes",
    color: "#6C63FF",
    intelligence: "Mental",
    emoji: "🧠",
  },
  {
    title: "Las 6 Decisiones mas importantes de tu Vida",
    author: "Sean Covey",
    duration: "8h 30m",
    rating: 4.7,
    slug: "6-decisiones",
    color: "#10B981",
    intelligence: "Social",
    emoji: "🤝",
  },
  {
    title: "Padre Rico, Padre Pobre para Adolescentes",
    author: "Robert Kiyosaki",
    duration: "6h 45m",
    rating: 4.6,
    slug: "padre-rico-padre-pobre",
    color: "#D4AF37",
    intelligence: "Financiera",
    emoji: "💰",
  },
  {
    title: "La Jornada Laboral de 4 Horas",
    author: "Jim Ferren",
    duration: "7h 15m",
    rating: 4.5,
    slug: "jornada-4-horas",
    color: "#F97316",
    intelligence: "Negocios",
    emoji: "💼",
  },
];

const INTELLIGENCES_DATA = [
  {
    name: "Inteligencia Mental",
    emoji: "🧠",
    color: "#6C63FF",
    description: "Mentalidad de crecimiento y mindset",
    totalHours: "19h",
    rating: 4.8,
    bookCount: 4,
    books: [
      { title: "Mindset: La Actitud del Exito", author: "Carol S. Dweck" },
      { title: "El Codigo de las Mentes Extraordinarias", author: "Vishen Lakhiani" },
    ],
  },
  {
    name: "Inteligencia Emocional",
    emoji: "❤️",
    color: "#FF6B6B",
    description: "Autoconocimiento y gestion emocional",
    totalHours: "26h",
    rating: 4.6,
    bookCount: 4,
    books: [
      { title: "Permiso para Sentir", author: "Marc Brackett" },
      { title: "Los Dones de la Imperfeccion", author: "Brene Brown" },
    ],
  },
  {
    name: "Inteligencia Financiera",
    emoji: "💰",
    color: "#D4AF37",
    description: "Comprension de recursos e inversiones",
    totalHours: "20h",
    rating: 4.6,
    bookCount: 4,
    books: [
      { title: "El Hombre Mas Rico de Babilonia", author: "George S. Clason" },
      { title: "Los Secretos de la Mente Millonaria", author: "T. Harv Eker" },
    ],
  },
  {
    name: "Inteligencia de Negocios Digitales",
    emoji: "💼",
    color: "#F59E0B",
    description: "Marketing digital y emprendimiento",
    totalHours: "25h",
    rating: 4.7,
    bookCount: 4,
    books: [
      { title: "La Vaca Purpura", author: "Seth Godin" },
      { title: "El Metodo Lean Startup", author: "Eric Ries" },
    ],
  },
  {
    name: "Inteligencia Fisica",
    emoji: "💪",
    color: "#F97316",
    description: "Salud corporal y habitos saludables",
    totalHours: "18h",
    rating: 4.8,
    bookCount: 4,
    books: [
      { title: "Spark", author: "John J. Ratey" },
      { title: "Habitos Atomicos", author: "James Clear" },
    ],
  },
  {
    name: "Inteligencia Espiritual",
    emoji: "🌟",
    color: "#A78BFA",
    description: "Proposito de vida y crecimiento espiritual",
    totalHours: "26h",
    rating: 4.8,
    bookCount: 4,
    books: [
      { title: "El Monje que Vendio su Ferrari", author: "Robin Sharma" },
      { title: "Una Vida con Proposito", author: "Rick Warren" },
    ],
  },
  {
    name: "Inteligencia Social",
    emoji: "🤝",
    color: "#10B981",
    description: "Habilidades sociales y de influencia",
    totalHours: "18h",
    rating: 4.7,
    bookCount: 4,
    books: [
      { title: "Como Ganar Amigos e Influir sobre las Personas", author: "Dale Carnegie" },
      { title: "El Poder de la Presencia", author: "Amy Cuddy" },
    ],
  },
];

const STATS = [
  { icon: CheckCircle, label: "7 Inteligencias", color: "#10B981" },
  { icon: Infinity, label: "Potencial", color: "#A78BFA" },
  { icon: Rocket, label: "1 Metodo unico", color: "#F97316" },
  { icon: Gift, label: "Libros Incluidos", color: "#D4AF37" },
];

export function InicioClient() {
  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-12">
      {/* ===== HERO ===== */}
      <section className="relative px-5 sm:px-6 lg:px-8 max-w-4xl mx-auto py-12 sm:py-20 lg:py-28 text-center overflow-hidden">
        {/* Mesh gradient blobs — mas pequenos en mobile */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent-primary/8 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-1/3 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-[#00B4D8]/6 rounded-full blur-[60px] sm:blur-[100px]" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative space-y-5 sm:space-y-6">
          <motion.div variants={fadeUp}>
            <Badge color="#A78BFA" className="mb-3">
              <Sparkles className="h-3 w-3" />
              Modelo Revolucionario
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[2.5rem] sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.05]"
          >
            Las 7 Inteligencias de{" "}
            <span className="bg-gradient-to-r from-accent-primary to-[#00B4D8] bg-clip-text text-transparent">
              StarBooks
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-text-secondary text-[15px] sm:text-[17px] lg:text-[19px] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Creada por{" "}
            <span className="text-accent-primary font-semibold">Henry Orellana</span>,
            StarBooks es la plataforma educativa digital numero uno, que transforma
            jovenes emprendedores mediante un metodo unico que une ciencia,
            tecnologia y los mejores libros para liberar todo tu potencial digital.
          </motion.p>

          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 sm:pt-6 max-w-xl mx-auto">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-border-subtle"
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: stat.color }} />
                <span className="text-[11px] sm:text-xs font-semibold text-text-primary">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== LIBROS PARA EMPEZAR ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <Badge color="#D4AF37" className="mb-3">
              <Sparkles className="h-3 w-3" />
              Comienza tu Viaje de Aprendizaje
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-3">
              Libros para Empezar
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              Accede a estos 4 libros imprescindibles que todo adolescente
              debe leer para iniciar con exito su camino como emprendedor digital
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STARTER_BOOKS.map((book) => (
              <motion.div key={book.title} variants={fadeUp}>
                <div className="rounded-2xl border p-5 transition-all bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-16 w-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${book.color}25, ${book.color}08)` }}
                    >
                      <BookOpen className="h-6 w-6" style={{ color: book.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{ backgroundColor: `${book.color}20`, color: book.color }}
                        >
                          {book.emoji} {book.intelligence}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1">{book.author}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {book.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-accent-success" fill="currentColor" />
                          {book.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/libro/${book.slug}`}>
                    <button className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary to-[#00B4D8] text-bg-primary text-sm font-semibold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2">
                      Leer Ahora <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== PLAN DE ESTUDIO / 7 INTELIGENCIAS ===== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Plan de Estudio Sistematizado
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              Estudia con estrategia. Lidera con inteligencia. Un plan estructurado
              para dominar las habilidades clave del futuro.
            </p>
          </motion.div>

          <div className="space-y-4">
            {INTELLIGENCES_DATA.map((intel) => (
              <motion.div key={intel.name} variants={fadeUp}>
                <IntelligenceCard intelligence={intel} />
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
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Listo para transformar tu mente?
          </h2>
          <p className="text-text-secondary text-sm">
            Explora toda la biblioteca y comienza tu viaje de aprendizaje
          </p>
          <Link href="/biblioteca">
            <Button size="lg">
              <BookOpen className="h-4 w-4" />
              Explorar Biblioteca
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function IntelligenceCard({
  intelligence,
}: {
  intelligence: (typeof INTELLIGENCES_DATA)[number];
}) {
  return (
    <div
      className="relative rounded-2xl border-l-[3px] border border-border-subtle p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
      style={{
        borderLeftColor: `${intelligence.color}70`,
        background: `linear-gradient(135deg, ${intelligence.color}08, transparent 60%)`,
        boxShadow: `0 2px 4px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${intelligence.color}15` }}
          >
            {intelligence.emoji}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-primary">
              {intelligence.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{intelligence.description}</p>
          </div>
        </div>
        <Badge color={intelligence.color}>
          <Star className="h-3 w-3" fill="currentColor" />
          {intelligence.rating}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
        <span>{intelligence.bookCount} libros</span>
        <span>{intelligence.totalHours} total</span>
      </div>

      {/* Libros */}
      <div className="space-y-2 mb-4">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
          Libros incluidos:
        </p>
        {intelligence.books.map((book) => (
          <div
            key={book.title}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03]"
          >
            <div
              className="h-8 w-6 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${intelligence.color}12` }}
            >
              <BookOpen className="h-3 w-3" style={{ color: intelligence.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">
                {book.title}
              </p>
              <p className="text-[10px] text-text-muted">{book.author}</p>
            </div>
          </div>
        ))}
        <p className="text-[10px] text-text-muted pl-2">
          +{intelligence.bookCount - intelligence.books.length} libros mas
        </p>
      </div>

      {/* CTA */}
      <Link href="/biblioteca">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110"
          style={{
            backgroundColor: `${intelligence.color}15`,
            color: intelligence.color,
            border: `1px solid ${intelligence.color}25`,
          }}
        >
          <Play className="h-3.5 w-3.5" />
          Explorar libros
        </button>
      </Link>
    </div>
  );
}
