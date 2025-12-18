declare module "@opennextjs/cloudflare/config" {
  export interface CloudflareConfig {
    outputDir?: string;
    incrementalCache?: any;
    [key: string]: any;
  }

  export function defineCloudflareConfig(
    config: CloudflareConfig
  ): CloudflareConfig;
}

declare module "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache" {
  const r2IncrementalCache: any;
  export default r2IncrementalCache;
}

