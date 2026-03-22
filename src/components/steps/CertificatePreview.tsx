"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

interface CertificatePreviewProps {
  studentName: string;
  bookTitle: string;
  score: number;
  date: string;
}

export function CertificatePreview({
  studentName,
  bookTitle,
  score,
  date,
}: CertificatePreviewProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloadError, setDownloadError] = useState(false);

  async function handleDownload() {
    if (!certRef.current) return;
    setDownloadError(false);

    // Canvas-based download
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1200;
      canvas.height = 800;

      // Fondo
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, 1200, 800);

      // Borde dorado
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 740);
      ctx.strokeStyle = "#D4AF3740";
      ctx.lineWidth = 1;
      ctx.strokeRect(45, 45, 1110, 710);

      // Logo
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("STARBOOKS", 600, 100);

      // Certifica
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px system-ui";
      ctx.fillText("CERTIFICADO DE FINALIZACION", 600, 160);

      // Nombre
      ctx.fillStyle = "#FAFAFA";
      ctx.font = "bold 40px serif";
      ctx.fillText(studentName || "Estudiante", 600, 300);

      // Linea
      ctx.strokeStyle = "#D4AF3760";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(300, 330);
      ctx.lineTo(900, 330);
      ctx.stroke();

      // Texto
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "18px system-ui";
      ctx.fillText("Ha completado exitosamente", 600, 390);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 28px serif";
      ctx.fillText(`"${bookTitle}"`, 600, 440);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "18px system-ui";
      ctx.fillText(`obteniendo ${score}% en la evaluacion final`, 600, 490);

      // Fecha
      ctx.fillStyle = "#71717A";
      ctx.font = "14px system-ui";
      ctx.fillText(date, 600, 580);

      // Firma
      ctx.fillStyle = "#D4AF37";
      ctx.font = "italic 18px serif";
      ctx.fillText("Starbiz Academy", 600, 650);
      ctx.fillStyle = "#71717A";
      ctx.font = "12px system-ui";
      ctx.fillText("starbooks.starbizacademy.com", 600, 680);

      const link = document.createElement("a");
      link.download = `certificado-${bookTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setDownloadError(true);
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: `Certificado Starbooks: ${bookTitle}`,
        text: `He completado "${bookTitle}" con ${score}% en Starbooks!`,
      });
    } catch {
      // No soportado o cancelado
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Certificado visual */}
      <div
        ref={certRef}
        className="relative rounded-2xl border-2 border-accent-primary/30 bg-gradient-to-br from-bg-secondary to-bg-primary p-8 sm:p-12 text-center overflow-hidden"
      >
        {/* Decoracion */}
        <div className="absolute inset-4 border border-accent-primary/10 rounded-xl pointer-events-none" />

        <Award className="h-12 w-12 text-accent-primary mx-auto mb-4" />

        <p className="text-xs text-text-muted uppercase tracking-[0.3em] mb-6">
          Certificado de finalizacion
        </p>

        <p className="text-sm text-text-muted mb-2">
          Certifica que
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
          {studentName || "Estudiante"}
        </h3>
        <div className="h-px w-48 bg-accent-primary/30 mx-auto my-4" />

        <p className="text-sm text-text-secondary mb-1">
          ha completado exitosamente
        </p>
        <p className="text-lg font-semibold text-accent-primary tracking-tight">
          &quot;{bookTitle}&quot;
        </p>
        <p className="text-sm text-text-secondary mt-1">
          obteniendo <span className="text-accent-primary font-bold">{score}%</span> en la evaluacion final
        </p>

        <div className="mt-8 text-xs text-text-muted">
          <p>{date}</p>
          <p className="mt-1 italic text-accent-primary/60">Starbiz Academy</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-3">
          <Button onClick={handleDownload} variant="secondary">
            <Download className="h-4 w-4" />
            Descargar
          </Button>
          <Button onClick={handleShare} variant="ghost">
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>
        {downloadError && (
          <p className="text-xs text-red-400">No se pudo descargar el certificado</p>
        )}
      </div>
    </motion.div>
  );
}
