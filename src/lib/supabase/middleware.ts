import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "https://app.starbizacademy.com";

  // Rutas publicas (no requieren auth)
  const publicPaths = ["/login", "/auth/hub-callback", "/auth/confirm", "/api/auth/hub-exchange"];
  const isPublic = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Redirect /registro to Hub Central (login stays for admin access)
  if (request.nextUrl.pathname === "/registro") {
    return NextResponse.redirect(new URL("/enrollment", hubUrl));
  }

  // Si ya esta autenticado y visita /login, redirigir a biblioteca
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/biblioteca", request.url));
  }

  // Todo lo demas requiere auth — redirigir a Hub si no esta autenticado
  if (!isPublic && !user) {
    return NextResponse.redirect(new URL("/enrollment", hubUrl));
  }

  // Proteger admin: verificar is_admin
  if (request.nextUrl.pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL("/biblioteca", request.url));
    }
  }

  return supabaseResponse;
}
