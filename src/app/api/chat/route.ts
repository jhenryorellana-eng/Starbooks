import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `Eres un tutor educativo de Starbooks, una plataforma de aprendizaje para jovenes emprendedores (13-18 anos). Tu rol es ayudar al estudiante a entender el contenido del capitulo que esta viendo.

Reglas:
- Responde en espanol, de forma clara y accesible para adolescentes
- Usa ejemplos practicos y relevantes para jovenes
- Se conciso: maximo 3-4 parrafos por respuesta
- Si el estudiante pregunta algo fuera del tema del capitulo, guialo amablemente de vuelta al contenido
- Motiva al estudiante y conecta los conceptos con emprendimiento juvenil
- No inventes informacion que no este en el contexto proporcionado`;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API de IA no configurada" },
        { status: 500 }
      );
    }

    // Verify authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensajes requeridos" },
        { status: 400 }
      );
    }

    // Build Gemini request
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nContexto del capitulo:\n${context || "Sin contexto disponible."}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Entendido. Estoy listo para ayudarte con este capitulo. ¿Que te gustaria saber?",
          },
        ],
      },
      ...messages.map(
        (msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })
      ),
    ];

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Error al procesar tu pregunta" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const response =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pude generar una respuesta. Intenta reformular tu pregunta.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
