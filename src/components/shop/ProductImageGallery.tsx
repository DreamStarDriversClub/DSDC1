"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const [lightboxOrigin, setLightboxOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

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
        setOrigin({ x: 50, y: 50 });
      }
      return !prev;
    });
  }, [hasImages]);

  /* ── Lightbox ─────────────────────────────────────────── */
  const openLightbox = useCallback(() => {
    if (!activeImage) return;
    setLightboxOpen(true);
    setLightboxZoom(false);
    document.body.style.overflow = "hidden";
  }, [activeImage]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxZoom(false);
    document.body.style.overflow = "";
  }, []);

  const handleLightboxMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!lightboxRef.current) return;
      const rect = lightboxRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLightboxOrigin({ x, y });
    },
    [],
  );

  const toggleLightboxZoom = useCallback(() => {
    setLightboxZoom((prev) => {
      if (!prev) setLightboxOrigin({ x: 50, y: 50 });
      return !prev;
    });
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox]);

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

            {/* Expand to fullscreen button — visible on all screens but most useful on mobile */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox();
              }}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:text-white group-hover:opacity-100 sm:opacity-0"
              aria-label="View fullscreen"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 8.25M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 8.25M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15.75" />
              </svg>
            </button>

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

      {/* ═══════ Fullscreen Lightbox ═══════ */}
      {lightboxOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            aria-label="Close fullscreen view"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom toggle button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLightboxZoom();
            }}
            className="absolute left-4 top-4 z-10 hidden rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white sm:block"
            aria-label={lightboxZoom ? "Zoom out" : "Zoom in"}
          >
            {lightboxZoom ? "Zoom Out" : "Zoom In"}
          </button>

          {/* Image count indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Lightbox image */}
          <div
            ref={lightboxRef}
            onMouseMove={handleLightboxMouseMove}
            onClick={(e) => {
              e.stopPropagation();
              toggleLightboxZoom();
            }}
            className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
              lightboxZoom ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
          >
            <Image
              src={toWebpPath(activeImage)}
              alt={`${productName} — fullscreen view ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className={`object-contain transition-transform duration-200 ease-out ${
                lightboxZoom ? "scale-[2]" : "scale-100"
              }`}
              style={{
                transformOrigin: `${lightboxOrigin.x}% ${lightboxOrigin.y}%`,
              }}
              priority
              quality={95}
              draggable={false}
            />
          </div>

          {/* Mobile-only tap hint */}
          <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm sm:hidden">
            Tap to zoom • Tap outside to close
          </div>

          {/* Thumbnail navigation in lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 gap-2 sm:flex">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                    setLightboxZoom(false);
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-ds-red w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
