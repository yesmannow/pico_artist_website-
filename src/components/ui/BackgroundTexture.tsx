import Image from "next/image";
import styles from "./BackgroundTexture.module.css";

type BlendMode = "overlay" | "multiply" | "soft-light" | "normal";

interface BackgroundTextureProps {
  src: string;
  opacity?: number;
  blend?: BlendMode;
  className?: string;
  grain?: boolean;
  priority?: boolean;
}

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
            className={`absolute inset-0 mix-blend-soft-light ${styles.noiseOverlay}`}
          />
          <div
            className={`absolute inset-0 ${styles.vignetteOverlay}`}
          />
        </>
      )}
    </div>
  );
}
