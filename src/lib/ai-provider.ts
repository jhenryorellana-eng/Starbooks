import type { AIProvider } from "@/types";

// Proveedor mock para desarrollo
class MockProvider implements AIProvider {
  async chat(
    messages: { role: "user" | "assistant"; content: string }[],
    context: string
  ): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return "No recibi tu mensaje.";

    const responses = [
      `Excelente pregunta sobre este capitulo. ${context.slice(0, 100)}... Basandome en el contenido, puedo decirte que este concepto es fundamental para entender la mentalidad financiera.`,
      `Me alegra que preguntes eso. Segun lo que explica el autor en este capitulo, la clave esta en cambiar tu perspectiva sobre el dinero y como funciona realmente.`,
      `Esa es una reflexion muy valiosa. El autor enfatiza que la educacion financiera es la base para construir verdadera libertad. No se trata solo de ganar mas, sino de entender como funciona el sistema.`,
      `Gran punto! En este capitulo se explica que la diferencia entre los ricos y los pobres no es cuanto ganan, sino como piensan sobre el dinero y que hacen con el.`,
    ];

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Factory para crear el proveedor activo
export function createAIProvider(): AIProvider {
  // Aqui se puede cambiar entre proveedores sin tocar los componentes
  return new MockProvider();
}
