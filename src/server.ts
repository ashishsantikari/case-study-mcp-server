import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ServiceRegistry } from "./registry.js";
import type { IKnowledgeBase } from "./types.js";

export async function startServer(configPath?: string): Promise<void> {
  const registry = new ServiceRegistry();
  registry.load(configPath);

  const server = new McpServer({
    name: "enpal-internal-knowledge",
    version: "1.0.0",
  });

  server.tool("list_knowledge_services", "List all available knowledge base services", {}, async () => {
    const services = registry.list().map((kb: IKnowledgeBase) => ({
      id: kb.id,
      name: kb.name,
      description: kb.description,
      markets: kb.frontmatter.markets,
      devices: kb.frontmatter.devices,
      categories: kb.frontmatter.categories,
      last_updated: kb.frontmatter.last_updated,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(services, null, 2) }],
    };
  });

  for (const kb of registry.list()) {
    const toolDef = kb.getToolDefinition();
    const queryDesc = toolDef.inputSchema.properties.query?.description ?? "Search query";

    const zodSchema: Record<string, z.ZodTypeAny> = {
      query: z.string().describe(queryDesc),
    };
    if (toolDef.inputSchema.properties.market) {
      zodSchema.market = z.string().optional().describe(toolDef.inputSchema.properties.market.description);
    }
    if (toolDef.inputSchema.properties.device) {
      zodSchema.device = z.string().optional().describe(toolDef.inputSchema.properties.device.description);
    }
    if (toolDef.inputSchema.properties.category) {
      zodSchema.category = z.string().optional().describe(toolDef.inputSchema.properties.category.description);
    }

    server.tool(
      toolDef.name,
      toolDef.description,
      zodSchema,
      async (args) => {
        const { query, market, device, category } = args as {
          query: string;
          market?: string;
          device?: string;
          category?: string;
        };
        const results = kb.search(query, { market, device, category });

        if (results.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No results found for your query in this knowledge base." }],
          };
        }

        const formattedText = results
          .map((r, i) => `### Result ${i + 1}: ${r.heading} (score: ${r.score.toFixed(2)})\n\n${r.content}\n\n---\n\n`)
          .join("");

        return {
          content: [{ type: "text" as const, text: formattedText }],
        };
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Enpal Internal Knowledge MCP server running on stdio");
}
