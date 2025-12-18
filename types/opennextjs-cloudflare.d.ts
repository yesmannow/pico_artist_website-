// Type declarations for @opennextjs/cloudflare
declare module "@opennextjs/cloudflare" {
  export interface CloudflareConfig {
    outputDir: string;
    incrementalCache?: unknown;
  }

  export function defineConfig(config: CloudflareConfig): CloudflareConfig;
}

