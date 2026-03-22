import { BookOpen } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Biblioteca", href: "/biblioteca" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Inteligencias", href: "/#inteligencias" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-[#00B4D8]">
                <BookOpen className="h-4 w-4 text-bg-primary" />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">
                Star<span className="text-accent-primary">books</span>
              </span>
            </Link>
            <p className="text-xs text-text-muted">by Starbiz Academy</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Starbooks. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
