"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { productGradient } from "@/lib/utils";
import { toWebpPath } from "@/lib/images";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productSlug: string;
  sku: string;
  salePercent?: number;
  /** Whether the product category is performance parts (changes placeholder icon) */
  isPerformance?: boolean;
  /** Whether the product category is accessories (changes placeholder icon) */
  isAccessories?: boolean;
}

/** Zoom magnification factor */
const ZOOM_SCALE = 2;

export function ProductImageGallery({
  images,
  productName,
  productSlug,
  sku,
  salePercent,
  isPerformance = false,
  isAccessories = false,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const gradient = productGradient(productSlug);

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
    setZoomed(false);
  }, []);

  const hasImages = Array.isArray(images) && images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  /* ── Desktop: cursor tracking ─────────────────────────── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Percentage position of cursor within the container
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    if (hasImages) setZoomed(true);
  }, [hasImages]);

  const handleMouseLeave = useCallback(() => {
    setZoomed(false);
  }, []);

  /* ── Mobile: tap toggle ───────────────────────────────── */
  const handleTap = useCallback(() => {
    if (!hasImages) return;
    setZoomed((prev) => {
      if (!prev) {
        // Center the zoom on first tap
        setOrigin({ x: 50, y: 50 });
      }
      return !prev;
    });
  }, [hasImages]);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
        role="img"
        aria-label={activeImage ? `${productName} — zoomable view` : `${productName} — no image available`}
        className={`relative flex aspect-square cursor-crosshair items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] ${gradient} group`}
      >
        {activeImage ? (
          <>
            {/* Zoomed image layer */}
            <Image
              src={toWebpPath(activeImage)}
              alt={`${productName} — view ${activeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-transform duration-200 ease-out ${
                zoomed ? "scale-[2]" : "scale-100"
              }`}
              style={{
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
              priority
              quality={90}
              draggable={false}
            />

            {/* Dark overlay hint — only when not zoomed */}
            {!zoomed && (
              <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/70 backdrop-blur-sm">
                  Hover to zoom
                </span>
              </div>
            )}

            {/* Zoom indicator on mobile — subtle hint */}
            {!zoomed && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-active:opacity-100 lg:hidden">
                <svg
                  className="h-8 w-8 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <svg
              className="h-20 w-20 text-ds-red/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.5}
            >
              {isPerformance ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                />
              ) : isAccessories ? (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              )}
            </svg>
            <span className="text-sm text-ds-gray-600">{sku}</span>
          </div>
        )}

        {/* Sale badge */}
        {salePercent != null && salePercent > 0 && (
          <div className="absolute left-4 top-4 z-10">
            <Badge variant="red" size="md">
              {salePercent}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail row with interactive click */}
      {Array.isArray(images) && images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleThumbnailClick(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-ds-red bg-ds-red/10"
                  : "border-white/[0.06] bg-ds-black-charcoal hover:border-white/[0.2]"
              }`}
              aria-label={`View ${productName} image ${i + 1}`}
            >
              <Image
                src={toWebpPath(img)}
                alt={`${productName} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
                quality={70}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
