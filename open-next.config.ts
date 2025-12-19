import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({
  // Keep defaults explicit so the Cloudflare build matches local builds
  default: {
    buildCommand: "next build",
  },
  output: {
    directory: ".open-next",
  },
});

