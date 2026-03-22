import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getIntelligenceColor(slug: string): string {
  const colors: Record<string, string> = {
    financiera: "var(--intel-financiera)",
    mental: "var(--intel-mental)",
    emocional: "var(--intel-emocional)",
    social: "var(--intel-social)",
    espiritual: "var(--intel-espiritual)",
    fisica: "var(--intel-fisica)",
    tecnologica: "var(--intel-tecnologica)",
  };
  return colors[slug] ?? "var(--accent-primary)";
}
