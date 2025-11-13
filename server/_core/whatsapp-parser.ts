export type ParsedCommand =
  | { type: "help" }
  | { type: "saldo" }
  | { type: "resumo" }
  | { type: "despesas" }
  | { type: "itens" }
  | { type: "gasto"; amountCents: number; description: string }
  | { type: "receita"; amountCents: number; description: string };

function parseAmountToCents(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.,]/g, "");
  if (!cleaned) return null;
  // Replace comma with dot and parse float
  const normalized = cleaned.replace(/,/g, ".");
  const value = parseFloat(normalized);
  if (Number.isNaN(value) || value <= 0) return null;
  return Math.round(value * 100);
}

export function parseWhatsappText(text: string): ParsedCommand | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;

  if (t === "ajuda" || t === "help") return { type: "help" };
  if (t === "saldo") return { type: "saldo" };
  if (t === "resumo") return { type: "resumo" };
  if (t === "despesas") return { type: "despesas" };
  if (t === "itens") return { type: "itens" };

  // gasto <valor> <descrição>
  if (t.startsWith("gasto ")) {
    const parts = t.split(/\s+/);
    if (parts.length >= 3) {
      const amountCents = parseAmountToCents(parts[1]);
      const description = parts.slice(2).join(" ");
      if (amountCents && description.trim().length > 0) {
        return { type: "gasto", amountCents, description };
      }
    }
  }

  // receita <valor> <descrição>
  if (t.startsWith("receita ")) {
    const parts = t.split(/\s+/);
    if (parts.length >= 3) {
      const amountCents = parseAmountToCents(parts[1]);
      const description = parts.slice(2).join(" ");
      if (amountCents && description.trim().length > 0) {
        return { type: "receita", amountCents, description };
      }
    }
  }

  return null;
}