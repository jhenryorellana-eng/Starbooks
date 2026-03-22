import type { StepInfo } from "@/types";

export const STEPS: StepInfo[] = [
  {
    number: 1,
    title: "Conoce al Autor",
    shortTitle: "Autor",
    description:
      "Escucha un resumen sobre quien es el autor, su historia y por que escribio este libro.",
    icon: "Headphones",
    emoji: "🎧",
  },
  {
    number: 2,
    title: "Resumen del Libro",
    shortTitle: "Resumen",
    description:
      "Lee un resumen completo que te prepara para profundizar en cada capitulo.",
    icon: "BookOpen",
    emoji: "📖",
  },
  {
    number: 3,
    title: "Mapa Conceptual",
    shortTitle: "Mapa",
    description:
      "Visualiza las ideas principales del libro en un mapa interactivo de conceptos.",
    icon: "Map",
    emoji: "🗺️",
  },
  {
    number: 4,
    title: "Libro Completo",
    shortTitle: "Capitulos",
    description:
      "Videos cinematograficos por capitulo con un chatbot de IA que responde tus preguntas.",
    icon: "Clapperboard",
    emoji: "🎬",
  },
  {
    number: 5,
    title: "Podcast de Expertos",
    shortTitle: "Podcast",
    description:
      "Escucha a expertos discutir y profundizar los temas del libro.",
    icon: "Mic",
    emoji: "🎙️",
  },
  {
    number: 6,
    title: "Comunidad",
    shortTitle: "Comunidad",
    description:
      "Comparte tu opinion, debate con otros estudiantes y construye tu red.",
    icon: "MessageCircle",
    emoji: "💬",
  },
  {
    number: 7,
    title: "Examen + Certificado",
    shortTitle: "Examen",
    description:
      "Demuestra lo que aprendiste y obten tu certificado digital.",
    icon: "Trophy",
    emoji: "🏆",
  },
];

export const INTELLIGENCES = [
  { name: "Mental", slug: "mental", emoji: "🧠", color: "#7C5CFC" },
  { name: "Fisica", slug: "fisica", emoji: "💪", color: "#FF6B35" },
  { name: "Emocional", slug: "emocional", emoji: "❤️", color: "#FF4B6E" },
  { name: "Social", slug: "social", emoji: "🤝", color: "#00E5A0" },
  { name: "Espiritual", slug: "espiritual", emoji: "✨", color: "#B07CFF" },
  { name: "Financiera", slug: "financiera", emoji: "💰", color: "#FFB020" },
  { name: "Tecnologica", slug: "tecnologica", emoji: "🚀", color: "#00D4FF" },
] as const;

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  basico: "Basico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};
