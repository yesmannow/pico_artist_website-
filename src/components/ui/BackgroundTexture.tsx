import Image from "next/image";

type BlendMode = "overlay" | "multiply" | "soft-light" | "normal";

interface BackgroundTextureProps {
  src: string;
  opacity?: number;
  blend?: BlendMode;
  className?: string;
  grain?: boolean;
  priority?: boolean;
}

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

export default function BackgroundTexture({
  src,
  opacity = 0.12,
  blend = "overlay",
  className = "",
  grain = true,
  priority = false,
}: BackgroundTextureProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
        style={{ mixBlendMode: blend, opacity }}
      />
      {grain && (
        <>
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{ backgroundImage: `url("${NOISE_SVG}")`, opacity: 0.25 }}
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_55%)]"
            style={{ opacity: 0.35 }}
          />
        </>
      )}
    </div>
  );
}
