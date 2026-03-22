"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Menu, X, User, Trophy, Library, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = useRef(createClient()).current;
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    closeMobileMenu();
    router.push("/login");
    router.refresh();
  }

  if (isAdmin) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-bg-primary/90 backdrop-blur-xl border-b border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.2)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo -> Inicio */}
          <Link href="/" className="flex items-center gap-2.5" onClick={closeMobileMenu}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-[#00B4D8]">
              <BookOpen className="h-5 w-5 text-bg-primary" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              Star<span className="text-accent-primary">books</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] flex items-center gap-2">
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <Link href="/biblioteca" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] flex items-center gap-2">
              <Library className="h-4 w-4" />
              Biblioteca
            </Link>
            <Link href="/comunidad" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Ranking
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/perfil" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mi perfil
                </Link>
                <button onClick={handleLogout} className="text-sm text-text-muted hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04] flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2">
                  Iniciar sesion
                </Link>
                <Link href="/registro" className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary to-[#00B4D8] text-bg-primary hover:brightness-110 transition-all">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-bg-primary/95 backdrop-blur-xl border-b border-border-subtle"
          >
            <div className="px-4 py-4 space-y-1">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors">
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <Link href="/biblioteca" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors">
                <Library className="h-4 w-4" />
                Biblioteca
              </Link>
              <Link href="/comunidad" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors">
                <Trophy className="h-4 w-4" />
                Ranking
              </Link>

              {isLoggedIn ? (
                <>
                  <Link href="/perfil" onClick={closeMobileMenu} className="flex items-center gap-2 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors">
                    <User className="h-4 w-4" />
                    Mi perfil
                  </Link>
                  <hr className="border-border-subtle my-2" />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors w-full cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-border-subtle my-2" />
                  <Link href="/login" onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors">
                    Iniciar sesion
                  </Link>
                  <Link href="/registro" onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl text-center font-medium bg-gradient-to-r from-accent-primary to-[#00B4D8] text-bg-primary">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
