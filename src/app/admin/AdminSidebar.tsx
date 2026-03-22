"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Brain,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/libros", label: "Libros", icon: BookOpen },
  { href: "/admin/autores", label: "Autores", icon: Users },
  { href: "/admin/inteligencias", label: "Inteligencias", icon: Brain },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle bg-bg-secondary/50 p-4 h-screen fixed top-0 left-0 overflow-y-auto z-30">
      <div className="mb-6">
        <Link
          href="/biblioteca"
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la app
        </Link>
        <h2 className="text-lg font-bold text-text-primary">
          Admin <span className="text-accent-primary">Panel</span>
        </h2>
        <p className="text-xs text-text-muted mt-1">Gestiona el contenido de Starbooks</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
