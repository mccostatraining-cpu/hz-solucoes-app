import { getOrCreateCategories } from "./db";

export async function autoCategorize(householdId: number, description: string): Promise<number | null> {
  const categories = await getOrCreateCategories(householdId);
  const text = description.toLowerCase();

  // Try to match keywords first
  for (const cat of categories) {
    const keywords = (cat.keywords || "").toLowerCase().split(/[,\s]+/).filter(Boolean);
    if (keywords.length === 0) continue;
    for (const kw of keywords) {
      if (kw && text.includes(kw)) {
        return cat.id;
      }
    }
  }

  // Fallback: simple heuristics by category names
  for (const cat of categories) {
    const name = (cat.name || "").toLowerCase();
    if (name && text.includes(name)) {
      return cat.id;
    }
  }

  return null;
}