"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept: "video/*" | "audio/*" | "image/*";
  bucket: string;
  folder: string;
  maxSizeMB?: number;
  label?: string;
}

export function FileUpload({
  value,
  onChange,
  accept,
  bucket,
  folder,
  maxSizeMB,
  label,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultMaxMB =
    accept === "video/*" ? 500 : accept === "audio/*" ? 50 : 10;
  const limitMB = maxSizeMB ?? defaultMaxMB;

  const typeLabel =
    accept === "video/*" ? "video" : accept === "audio/*" ? "audio" : "imagen";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > limitMB * 1024 * 1024) {
      setError(`Archivo muy grande (max ${limitMB}MB)`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir");
      }

      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const hasValue = value && !value.includes("placeholder");

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs text-text-muted font-medium mb-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`URL de ${typeLabel} o sube un archivo`}
          className="flex-1 rounded-lg bg-white/[0.04] border border-border-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Subiendo..." : "Subir"}
        </button>
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Preview */}
      {hasValue && accept === "image/*" && (
        <img
          src={value}
          alt="Preview"
          className="max-h-32 rounded-lg border border-border-subtle object-cover"
        />
      )}
      {hasValue && accept === "video/*" && value.includes("supabase.co") && (
        <video
          src={value}
          controls
          preload="metadata"
          className="w-full max-h-40 rounded-lg border border-border-subtle"
        />
      )}
      {hasValue && accept === "audio/*" && value.includes("supabase.co") && (
        <audio src={value} controls preload="metadata" className="w-full" />
      )}
    </div>
  );
}
