// Type declarations for @opennextjs/cloudflare
declare module "@opennextjs/cloudflare" {
  export interface CloudflareConfig {
    outputDir: string;
    incrementalCache?: unknown;
    [key: string]: unknown;
  }

  export function defineConfig(config: CloudflareConfig): CloudflareConfig;
}

// Legacy declarations (kept for backward compatibility if needed)
declare module "@opennextjs/cloudflare/config" {
  type CloudflareIncrementalCache = Record<string, unknown>;

  export interface CloudflareConfig {
    outputDir?: string;
    incrementalCache?: CloudflareIncrementalCache;
    [key: string]: unknown;
  }

  export function defineCloudflareConfig(
    config: CloudflareConfig
  ): CloudflareConfig;
}

declare module "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache" {
  const r2IncrementalCache: Record<string, unknown>;
  export default r2IncrementalCache;
}

