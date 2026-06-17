import type { IKnowledgeBase, Frontmatter, SearchResult, SearchFilters, ToolDefinition } from "../types.js";

export abstract class BaseKnowledgeBase implements IKnowledgeBase {
  id!: string;
  name!: string;
  description!: string;
  frontmatter!: Frontmatter;

  abstract search(query: string, filters?: SearchFilters): SearchResult[];
  abstract getToolDefinition(): ToolDefinition;
}
