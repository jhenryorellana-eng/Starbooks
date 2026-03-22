"use client";

import { cn } from "@/lib/utils";
import { Home, Library, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio", icon: Home, exact: true },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/comunidad", label: "Ranking", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/registro" || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-primary/95 backdrop-blur-xl border-t border-border-subtle shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around pt-2 pb-[max(0.5rem,var(--safe-bottom))]">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all min-w-[60px]",
                isActive
                  ? "text-accent-primary"
                  : "text-text-muted active:text-text-secondary active:scale-95"
              )}
            >
              <item.icon className={cn("h-[22px] w-[22px]", isActive && "drop-shadow-[0_0_6px_rgba(124,92,252,0.4)]")} />
              <span className={cn("text-[10px] font-semibold", isActive && "text-[11px]")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
