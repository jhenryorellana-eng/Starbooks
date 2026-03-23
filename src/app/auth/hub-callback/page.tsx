"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function HubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "verifying" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("No se recibió token de acceso");
      setStatus("error");
      return;
    }
    exchangeToken(token);
  }, [searchParams]);

  async function exchangeToken(token: string) {
    try {
      setStatus("verifying");

      const res = await fetch("/api/auth/hub-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error de autenticación");
      }

      if (data.verifyUrl) {
        // Use Supabase to verify the magic link token
        const supabase = createClient();
        const url = new URL(data.verifyUrl, window.location.origin);
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type") as "magiclink";

        if (tokenHash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });

          if (verifyError) {
            throw new Error("Error verificando sesión");
          }
        }

        router.replace("/biblioteca");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  if (status === "error") {
    const hubUrl =
      process.env.NEXT_PUBLIC_HUB_URL || "https://app.starbizacademy.com";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-400">&#10007;</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Error de acceso
          </h1>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <a
            href={hubUrl}
            className="inline-block px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            Volver al Hub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Verificando acceso...</p>
      </div>
    </div>
  );
}

export default function HubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HubCallbackContent />
    </Suspense>
  );
}
