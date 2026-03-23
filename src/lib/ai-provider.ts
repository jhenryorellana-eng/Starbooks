import type { AIProvider } from "@/types";

class GeminiProvider implements AIProvider {
  async chat(
    messages: { role: "user" | "assistant"; content: string }[],
    context: string
  ): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, context }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al comunicarse con el asistente");
    }

    return data.response;
  }
}

export function createAIProvider(): AIProvider {
  return new GeminiProvider();
}
