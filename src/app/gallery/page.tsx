import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import AudioPlayer from "@/components/AudioPlayer";
import manifest from "@/data/media-manifest.json";
import { MediaItem } from "@/lib/galleryUtils";

export const runtime = "nodejs";
export const revalidate = 900;

const buildGalleryFeed = unstable_cache(
  async (): Promise<MediaItem[]> => {
    const videoEntries: MediaItem[] =
      manifest.videos?.map((video) => ({
        id: video.id,
        type: "video" as const,
        filename: video.id,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.title || "Piko FG video",
      })) ?? [];

    const imageEntries: MediaItem[] =
      manifest.images?.map((image, index) => ({
        id: `image-${index}`,
        type: "image" as const,
        filename: image,
        url: `/gallery/${image}`,
        title: image.replace(/\.(webp|jpg|png)$/i, "").replace(/_/g, " "),
      })) ?? [];

    return [...videoEntries, ...imageEntries];
  },
  ["gallery-feed"],
  { revalidate, tags: ["gallery"] }
);

const previewTracks = [
  {
    id: "te-prometo",
    title: "Te Prometo (Preview)",
    artist: "Piko FG",
    src: encodeURI("/assets/audio/previews/Te Prometo.mp3"),
  },
  {
    id: "el-don",
    title: "El Don (Preview)",
    artist: "Piko FG",
    src: encodeURI("/assets/audio/previews/El Don.mp3"),
  },
  {
    id: "party",
    title: "Party (Preview)",
    artist: "Piko FG",
    src: encodeURI("/assets/audio/previews/Party.mp3"),
  },
];

export default async function GalleryPage() {
  const mediaItems = await buildGalleryFeed();

  return (
    <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <div className="film-grain" aria-hidden="true" />

      <header className="relative space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-piko-teal/70">
          Digital Graffiti / Gallery
        </p>
        <h1 className="text-3xl font-semibold text-zinc-50 sm:text-4xl">
          Frames &amp; Frequencies
        </h1>
        <p className="max-w-2xl text-sm text-zinc-300">
          ISR-backed gallery pulling YouTube thumbnails and studio stills. Media
          is tagged for on-demand revalidation while keeping GPU-friendly
          rendering — static assets for idle tiles, motion when active.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {mediaItems.map((item) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900/60 shadow-xl transition-colors duration-200 hover:border-piko-teal/50"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {item.type === "video" ? (
                <Link
                  href={item.url}
                  className="block h-full w-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${item.filename}/hqdefault.jpg`}
                    alt={item.title || "Piko FG video"}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover transition duration-500 will-change-transform group-hover:scale-105"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </Link>
              ) : (
                <Image
                  src={item.url}
                  alt={item.title || "Piko FG still"}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover transition duration-500 will-change-transform group-hover:scale-105"
                  priority={false}
                />
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-50">
                  {item.title || "Untitled"}
                </p>
                <p className="text-xs uppercase tracking-wide text-zinc-400">
                  {item.type === "video" ? "YouTube / Thumbnail" : "Still"}
                </p>
              </div>
              <span className="rounded-full bg-piko-teal/15 px-3 py-1 text-xs font-medium text-piko-teal">
                ISR
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/10 via-transparent to-piko-pink/10" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-piko-pink/70">
                Audio Lab / V2 Scaffold
              </p>
              <h2 className="text-lg font-semibold text-zinc-50">
                Embedded tracklist with visualizer-ready bridge
              </h2>
            </div>
            <span className="rounded-full border border-piko-pink/40 bg-piko-pink/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-piko-pink">
              Node 20 • WebAudio
            </span>
          </div>
          <AudioPlayer tracks={previewTracks} />
        </div>
      </section>
    </div>
  );
}
