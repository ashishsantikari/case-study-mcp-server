import type { SectionChunk, SearchResult, SearchFilters } from "../types.js";

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function tf(tokens: string[], term: string): number {
  const count = tokens.filter((t) => t === term).length;
  return tokens.length > 0 ? count / tokens.length : 0;
}

function idf(chunks: SectionChunk[], term: string): number {
  const docsWithTerm = chunks.filter((c) => {
    const docTokens = tokenize(c.heading + " " + c.content);
    return docTokens.includes(term);
  }).length;
  return Math.log((chunks.length + 1) / (docsWithTerm + 1)) + 1;
}

function matchesFilter(chunk: SectionChunk, filters: SearchFilters): boolean {
  if (filters.market) {
    const m = filters.market.toLowerCase();
    if (
      !chunk.markets.some(
        (sm) => sm.toLowerCase().includes(m) || m.includes(sm.toLowerCase())
      )
    ) {
      return false;
    }
  }
  if (filters.device) {
    const d = filters.device.toLowerCase().replace(/[-\s]/g, "");
    if (
      !chunk.devices.some(
        (sd) => sd.toLowerCase().replace(/[-\s]/g, "") === d
      )
    ) {
      return false;
    }
  }
  if (filters.category) {
    const cat = filters.category.toLowerCase();
    if (!chunk.categories.some((sc) => sc.toLowerCase() === cat)) {
      return false;
    }
  }
  return true;
}

export function search(
  chunks: SectionChunk[],
  query: string,
  filters?: SearchFilters
): SearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const applicable = filters
    ? chunks.filter((c) => matchesFilter(c, filters))
    : chunks;

  if (applicable.length === 0) return [];

  const scored: SearchResult[] = applicable.map((chunk) => {
    const docTokens = tokenize(chunk.heading + " " + chunk.content);
    let score = 0;
    for (const qt of queryTokens) {
      score += tf(docTokens, qt) * idf(applicable, qt);
    }
    for (const qt of queryTokens) {
      if (tokenize(chunk.heading).includes(qt)) score += 2;
    }
    return { heading: chunk.heading, content: chunk.content, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}
