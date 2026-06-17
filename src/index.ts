#!/usr/bin/env node
import { startServer } from "./server.js";

startServer().catch((err: unknown) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
