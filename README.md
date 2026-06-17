# Enterprise Knowledge Mesh — An MCP Server for Structured Data Lake Retrieval

> **AI Runtime Platform Feature** — tagged as `knowledge-mesh-mcp`

---

## Executive Summary

Modern enterprises operate across multiple domains—legal, human resources, compliance, engineering, finance—each maintaining its own body of institutional knowledge. This knowledge is typically trapped in static documents, wikis, and PDFs, making it inaccessible to AI-powered assistants and automation pipelines. The **Enterprise Knowledge Mesh** solves this by exposing domain-specific knowledge bases as composable tools through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io), enabling LLMs to retrieve relevant, filtered, and rank-ordered information from a unified data lake with zero boilerplate integration.

This project demonstrates how a renewable energy company with operations across multiple markets, device types, and regulatory regimes can centralize its fragmented knowledge into a single MCP server that any AI agent can query in real time.

---

## Problem Statement

Enterprise knowledge management suffers from three systemic failures:

| Failure | Impact |
|---|---|
| **Siloed documentation** | Legal contracts live in a DMS, HR policies in the intranet, compliance checklists in SharePoint. No single entry point. |
| **Context blindness** | A query like "What are the warranty terms for solar panels in Berlin?" requires cross-referencing market-specific regulations, device-specific policies, and category-specific contract terms. |
| **No structured access for AI** | LLMs cannot natively query internal databases. Prompt engineering with static RAG chunks is brittle, ungoverned, and unobservable. |

**The result:** employees waste hours searching for answers, compliance risks go undetected, and AI-assisted workflows stall because models cannot reliably access enterprise ground truth.

---

## Solution Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   AI Agent / LLM                         │
│  (Claude, ChatGPT, Cursor, Copilot, custom agent)        │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol (stdio/SSE)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Enterprise Knowledge Mesh MCP Server         │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Legal KB    │  │   HR KB     │  │ Compliance  │ ...  │
│  │  (MCP Tool)  │  │ (MCP Tool)  │  │ KB (MCP     │      │
│  │              │  │             │  │   Tool)     │      │
│  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                 │                │              │
│         └────────┬────────┴────────┬───────┘              │
│                  ▼                  ▼                      │
│         ┌──────────────────────────────────┐              │
│         │    TF-IDF Search Engine           │              │
│         │  (tokenize → TF × IDF → rank)    │              │
│         │  + filter pipeline               │              │
│         └──────────────────────────────────┘              │
│                  ▲                                         │
│         ┌────────┴────────┐                                │
│         │  ServiceRegistry │                                │
│         │  (YAML → class) │                                │
│         └─────────────────┘                                │
│                  ▲                                         │
│         ┌────────┴────────┐                                │
│         │  services.yaml  │                                │
│         │  (declarative   │                                │
│         │   config)       │                                │
│         └─────────────────┘                                │
└──────────────────────────────────────────────────────────┘
```

### Core Design Decisions

**1. MCP Protocol as the Integration Standard**

Rather than building a custom REST API or GraphQL endpoint, the server implements the [Model Context Protocol](https://modelcontextprotocol.io)—an open standard from Anthropic that defines how AI applications communicate with tools and data sources. This makes the knowledge mesh immediately compatible with every major AI assistant and IDE without adapter code.

**2. Declarative Service Configuration**

Services are defined in a single `services.yaml` file:

```yaml
services:
  - id: legal
    name: Legal Knowledge Base
    description: Contracts, policies, and regulatory information
    markdown: src/services/legal/legal.md

  - id: hr
    name: HR Knowledge Base
    description: Employee policies, benefits, leave, and workplace guidelines
    markdown: src/services/hr/hr.md

  - id: compliance
    name: Compliance Knowledge Base
    description: Regulatory compliance, data protection, audit requirements
    markdown: src/services/compliance/compliance.md
```

Adding a new domain requires nothing more than a YAML entry and a markdown file. No routing code, no controller logic, no boilerplate.

**3. Metadata-Driven Filtering**

Each knowledge base and every section within it carries a metadata signature:

```
> **Markets:** Berlin, Frankfurt, Munich, Hamburg
> **Devices:** Solar Panel, Battery-Storage, Inverter
> **Categories:** Contracts, Warranty, Liability
```

This enables cross-dimensional filtering: queries can target a specific market, device, category, or any combination thereof. A compliance officer asking "What are the GDPR requirements for smart meters in Berlin?" gets results scoped to the intersection of `market: berlin`, `device: inverter`, `category: gdpr`.

**4. TF-IDF Ranking for Relevance**

The search engine uses a classic information-retrieval approach:
- **Tokenization** splits queries and documents into normalized term vectors
- **Term Frequency (TF)** measures how often a term appears within a section
- **Inverse Document Frequency (IDF)** downweights terms that appear everywhere
- **Heading boost** applies a multiplier (+2) when a query term matches a section heading
- **Top-3 truncation** returns the three most relevant results per query

This approach is deterministic, auditable, and requires no external AI dependencies or GPU infrastructure.

---

## Current Knowledge Domains

### Legal Knowledge Base
Contracts, warranty terms, liability frameworks, consumer rights, data protection clauses, and grid connection requirements across four German markets (Berlin, Frankfurt, Munich, Hamburg). Covers devices: solar panels, battery storage, inverters, car chargers.

### HR Knowledge Base
Remote work policies, vacation and leave regulations (including regional variations), parental leave top-ups, health insurance benefits, compensation and bonus structures, professional development budgets, onboarding processes, mental health programs, and anti-discrimination policies.

### Compliance Knowledge Base
GDPR compliance for smart meter data, ISO 27001 information security requirements, VDE electrical safety standards, EEG 2023 renewable energy law, grid connection compliance, internal audit procedures, incident reporting obligations, and anti-corruption/ethics policies.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- An MCP-compatible client (Claude Desktop, VS Code with Cline, any custom agent)

### Installation

```bash
git clone <repository-url>
cd acme-energy-mcp
npm install
npm run build
```

### Configuration

Edit `services.yaml` to add, remove, or modify knowledge bases. Each service requires:
- `id` — unique identifier (used as the MCP tool name prefix)
- `name` — human-readable label
- `description` — tool description exposed to the LLM
- `markdown` — path to the markdown file relative to project root

### Markdown Structure

Each markdown file must include:

1. **YAML frontmatter** — service-level metadata bounded by `---` delimiters:
   ```yaml
   ---
   name: Legal Knowledge Base
   description: Contracts and regulatory information
   markets: [berlin, frankfurt, munich, hamburg]
   devices: [solar-panel, battery-storage, inverter, car-charger]
   categories: [contracts, warranty, liability, consumer-rights, data-protection]
   last_updated: 2025-11-15
   ---
   ```

2. **H2 sections** — each `## Heading` becomes a searchable chunk:
   ```markdown
   ## Solar Panel Installation Contracts
   > **Markets:** Berlin, Frankfurt, Munich, Hamburg
   > **Devices:** Solar Panel
   > **Categories:** Contracts, Consumer-Rights

   All Acme Energy solar panel installation contracts include...
   ```

### Running the Server

```bash
npm run dev        # Development (hot-reload via tsx)
npm start          # Production (runs compiled dist/index.js)
```

The server runs on stdio transport, which is the native integration mode for MCP clients.

### Client Integration

To connect from any MCP-compatible client:

```json
{
  "mcpServers": {
    "acme-energy-knowledge": {
      "command": "node",
      "args": ["/path/to/acme-energy-mcp/dist/index.js"]
    }
  }
}
```

The server exposes one tool per knowledge base dynamically. For the three configured services, the LLM sees:

| Tool Name | Description |
|---|---|
| `query_legal` | Search the Legal Knowledge Base with optional market/device/category filters |
| `query_hr` | Search the HR Knowledge Base with optional market/category filters |
| `query_compliance` | Search the Compliance Knowledge Base with optional market/device/category filters |

Each tool accepts a `query` string and optional `market`, `device`, and `category` filter parameters, populated dynamically from the frontmatter metadata.

---

## Testing

```bash
npm test             # Run all tests (vitest)
npm run test:watch   # Watch mode
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
```

---

## Extending the Knowledge Mesh

### Adding a New Knowledge Domain

1. Create a markdown file in `src/services/<domain>/<domain>.md` with frontmatter and H2 sections
2. Add a YAML entry to `services.yaml` pointing to the new file
3. Restart the server — the new tool appears automatically

### Customizing the Search Engine

The TF-IDF implementation lives in `src/search/engine.ts`. It can be replaced with:
- **Embedding-based retrieval** (OpenAI, Cohere, Voyage) for semantic search
- **BM25** for improved lexical matching
- **Hybrid search** combining both with reciprocal rank fusion
- **Vector database integration** (pgvector, Pinecone, Chroma) for scale

The `IKnowledgeBase` interface (`src/types.ts`) abstracts the search contract, so swapping engines requires no changes to the MCP server or service registry.

---

## Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Core MCP server with YAML-configurable knowledge bases | ✅ Complete |
| 2 | TF-IDF search with metadata filtering | ✅ Complete |
| 3 | Dynamic MCP tool generation from service config | ✅ Complete |
| 4 | Multi-market, multi-device, multi-category filtering | ✅ Complete |
| 5 | Embedding-based semantic search (pluggable engine) | 🔜 Planned |
| 6 | SSE transport for remote server deployment | 🔜 Planned |
| 7 | Authentication and authorization layer | 🔜 Planned |
| 8 | Analytics and usage observability | 🔜 Planned |
| 9 | Real-time content sync from upstream systems (SharePoint, Confluence) | 🔜 Planned |
| 10 | Cross-knowledge-base query routing ("ask anything") | 🔜 Planned |

---

## Design Philosophy

1. **Protocol, not framework.** By implementing MCP, this project integrates with the entire AI ecosystem rather than a single vendor's platform.
2. **Content over code.** Knowledge is authored in plain markdown with YAML frontmatter—editable by domain experts, version-controlled in git, and deployable via CI/CD.
3. **Deterministic retrieval first.** TF-IDF is transparent, debuggable, and works offline. Semantic search can be layered on when needed, but the foundation is auditable.
4. **Composable by default.** Each knowledge base is an independent MCP tool. Agents can query one, many, or all, and the filter system enables precise cross-section queries.
5. **Self-describing tools.** The MCP tool definitions are generated from frontmatter metadata, so the LLM always knows which filters are available without hardcoding.

---

## Technical Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 20+ (ESM) |
| Language | TypeScript 5.8 (strict mode) |
| MCP SDK | `@modelcontextprotocol/sdk` v1.12 |
| Search | Custom TF-IDF engine |
| Configuration | YAML via `js-yaml` |
| Validation | Zod 3.24 |
| Testing | Vitest 3.1 |
| Linting | ESLint 9 with typescript-eslint |

---

## License

Private / Internal use. This project is designed as an enterprise internal tool.

---

## About This Case Study

This project was built as a coding challenge to demonstrate how the Model Context Protocol can serve as an enterprise knowledge mesh—transforming static documentation into composable, AI-accessible tools. The architecture patterns shown here are applicable across industries: financial services (regulatory handbooks), healthcare (clinical protocols), manufacturing (equipment manuals), and any organization where institutional knowledge must be made available to AI agents in a structured, filterable, and observable way.
