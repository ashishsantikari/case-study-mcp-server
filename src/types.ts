export interface Frontmatter {
  name: string;
  description: string;
  markets: string[];
  devices: string[];
  categories: string[];
  last_updated: string;
}

export interface SectionChunk {
  heading: string;
  content: string;
  markets: string[];
  devices: string[];
  categories: string[];
}

export interface SearchResult {
  heading: string;
  content: string;
  score: number;
}

export interface SearchFilters {
  market?: string;
  device?: string;
  category?: string;
}

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  markdown: string;
}

export interface ServicesConfig {
  services: ServiceConfig[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export interface IKnowledgeBase {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly frontmatter: Frontmatter;
  search(query: string, filters?: SearchFilters): SearchResult[];
  getToolDefinition(): ToolDefinition;
}
