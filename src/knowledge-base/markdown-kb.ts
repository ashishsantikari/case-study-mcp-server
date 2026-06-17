import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { BaseKnowledgeBase } from "./base.js";
import { search as searchEngine } from "../search/engine.js";
import type { ServiceConfig, SectionChunk, SearchResult, SearchFilters, ToolDefinition } from "../types.js";

const frontmatterSchema = z.object({
  name: z.string(),
  description: z.string(),
  markets: z.array(z.string()).default([]),
  devices: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  last_updated: z.string(),
});

const METADATA_LINE_RE = /^>\s*\*\*Markets:\*\*\s*(?<markets>[^|]*?)\s*(?:\|\s*\*\*Devices:\*\*\s*(?<devices>[^|]*?))?\s*(?:\|\s*\*\*Categories:\*\*\s*(?<categories>.*?))?\s*$/i;

function parseMetadataLine(line: string): Pick<SectionChunk, "markets" | "devices" | "categories"> {
  const match = line.match(METADATA_LINE_RE);
  if (!match) return { markets: [], devices: [], categories: [] };

  const markets = (match.groups?.markets ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const devices = (match.groups?.devices ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const categories = (match.groups?.categories ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return { markets, devices, categories };
}

export class MarkdownKnowledgeBase extends BaseKnowledgeBase {
  private workingDir: string;
  private sections: SectionChunk[] = [];

  constructor(config: ServiceConfig, cwd?: string) {
    super();
    this.workingDir = cwd ?? process.cwd();
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;

    const markdownPath = resolve(this.workingDir, config.markdown);
    const raw = readFileSync(markdownPath, "utf-8");

    const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error(`No frontmatter found in ${config.markdown}`);
    }

    const parsedFrontmatter = parse(frontmatterMatch[1]);
    this.frontmatter = frontmatterSchema.parse(parsedFrontmatter);

    const body = raw.slice(frontmatterMatch[0].length).trim();

    const sections: SectionChunk[] = [];
    const sectionRegex = /^## (.+)$/gm;
    let match: RegExpExecArray | null;
    const headings: { title: string; start: number }[] = [];
    while ((match = sectionRegex.exec(body)) !== null) {
      headings.push({ title: match[1].trim(), start: match.index });
    }

    for (let i = 0; i < headings.length; i++) {
      const { title, start } = headings[i];
      const nextStart = i + 1 < headings.length ? headings[i + 1].start : body.length;
      let rawContent = body.slice(start + title.length + 3, nextStart).trim();

      let markets: string[] = [];
      let devices: string[] = [];
      let categories: string[] = [];

      const lines = rawContent.split("\n");
      if (lines.length > 0 && /^>\s*\*\*Markets:/i.test(lines[0])) {
        const meta = parseMetadataLine(lines[0]);
        markets = meta.markets;
        devices = meta.devices;
        categories = meta.categories;
        lines.shift();
      }
      rawContent = lines.join("\n").trim();

      sections.push({
        heading: title,
        content: rawContent,
        markets,
        devices,
        categories,
      });
    }

    this.sections = sections;
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    return searchEngine(this.sections, query, filters);
  }

  getToolDefinition(): ToolDefinition {
    const properties: Record<string, { type: string; description: string }> = {
      query: {
        type: "string",
        description: "The search query string",
      },
    };

    if (this.frontmatter.markets.length > 0) {
      properties.market = {
        type: "string",
        description: `Filter by market. Examples: ${this.frontmatter.markets.join(", ")}`,
      };
    }

    if (this.frontmatter.devices.length > 0) {
      properties.device = {
        type: "string",
        description: `Filter by device. Examples: ${this.frontmatter.devices.join(", ")}`,
      };
    }

    if (this.frontmatter.categories.length > 0) {
      properties.category = {
        type: "string",
        description: `Filter by category. Examples: ${this.frontmatter.categories.join(", ")}`,
      };
    }

    return {
      name: `query_${this.id}`,
      description: `Search the ${this.name} for relevant information. Use optional filters for more targeted results.`,
      inputSchema: {
        type: "object",
        properties,
        required: ["query"],
      },
    };
  }
}
