import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "magiclink" | "email";

  if (token_hash && type) {
    const supabase = await createClient();
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  return NextResponse.redirect(new URL("/biblioteca", request.url));
}
