import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function verifyBridgeToken(token: string): Record<string, unknown> | null {
  const secret = process.env.STARBOOKS_BRIDGE_SECRET;
  if (!secret) throw new Error("STARBOOKS_BRIDGE_SECRET not set");

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;

  // Verify signature
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  // Decode payload
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());

  // Check expiration
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    // Verify bridge token from Hub Central
    const payload = verifyBridgeToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    const { email, name, sub: hubUserId } = payload as {
      email: string;
      name: string;
      sub: string;
    };

    const adminSupabase = createAdminClient();

    // Check if user already exists in Starbooks Supabase
    const { data: existingUsers } = await adminSupabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user in Starbooks Supabase
      const { data: newUser, error: createError } =
        await adminSupabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: name },
        });

      if (createError || !newUser.user) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { error: "Error creando cuenta" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    }

    // Update profile with enrollment status and hub_user_id
    await adminSupabase
      .from("profiles")
      .update({
        enrollment_status: "active",
        hub_user_id: hubUserId,
        full_name: name,
      })
      .eq("id", userId);

    // Generate a session for this user (magic link approach)
    const { data: linkData, error: linkError } =
      await adminSupabase.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (linkError || !linkData) {
      console.error("Error generating link:", linkError);
      return NextResponse.json(
        { error: "Error generando sesión" },
        { status: 500 }
      );
    }

    // Extract the token hash from the magic link to create a session
    const tokenHash = linkData.properties?.hashed_token;

    return NextResponse.json({
      success: true,
      verifyUrl: `/auth/confirm?token_hash=${tokenHash}&type=magiclink`,
    });
  } catch (error) {
    console.error("Hub exchange error:", error);
    return NextResponse.json(
      { error: "Error en el intercambio" },
      { status: 500 }
    );
  }
}
