// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	// Required: where Next.js build output goes
	outputDir: ".open-next/output",

	// R2 incremental cache configuration
	incrementalCache: r2IncrementalCache,
});
