import type { IKnowledgeBase } from "./types.js";
import { loadConfig } from "./config.js";
import { MarkdownKnowledgeBase } from "./knowledge-base/markdown-kb.js";

export class ServiceRegistry {
  private services = new Map<string, IKnowledgeBase>();

  load(configPath?: string): void {
    const config = loadConfig(configPath);
    for (const svc of config.services) {
      const kb = new MarkdownKnowledgeBase(svc);
      this.services.set(svc.id, kb);
    }
  }

  get(id: string): IKnowledgeBase | undefined {
    return this.services.get(id);
  }

  list(): IKnowledgeBase[] {
    return Array.from(this.services.values());
  }
}
