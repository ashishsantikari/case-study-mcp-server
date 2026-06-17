import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import type { ServicesConfig } from "./types.js";

const serviceConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  markdown: z.string(),
});

const servicesConfigSchema = z.object({
  services: z.array(serviceConfigSchema),
});

export function loadConfig(configPath?: string): ServicesConfig {
  const path = configPath ?? resolve(process.cwd(), "services.yaml");
  const raw = readFileSync(path, "utf-8");
  const parsed = parse(raw);
  return servicesConfigSchema.parse(parsed) as ServicesConfig;
}
