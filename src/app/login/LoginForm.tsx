"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookOpen, Mail, Lock } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/biblioteca";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Email o contrasena incorrectos"
            : authError.message
        );
        return;
      }

      // Check if user is admin → redirect to admin panel
      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", authData.user.id)
          .single();

        if (profile?.is_admin) {
          router.push("/admin");
          router.refresh();
          return;
        }
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Error de conexion. Verifica tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-24">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-primary to-[#00B4D8] flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-bg-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Iniciar sesion
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Continua tu viaje de aprendizaje
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs text-text-muted font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs text-text-muted font-medium">
              Contrasena
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contrasena"
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" isLoading={loading} className="w-full">
            Iniciar sesion
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted">
          No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-accent-primary hover:text-accent-success transition-colors"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
