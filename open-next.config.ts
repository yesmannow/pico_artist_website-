import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({
  // Required: where Next.js build output goes
  outputDir: ".open-next/output",

  // Optional: configure caching, bindings, etc.
  // For now keep it minimal until you add R2 or KV
});
