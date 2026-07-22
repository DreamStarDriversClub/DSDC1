import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface CategoryHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

export function CategoryHeader({ title, description, image }: CategoryHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-ds-black-deepest">
      {/* Full-bleed background image */}
      {image && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={85}
          />
          {/* Dark overlay — always rendered when image exists so text is readable */}
          <div className="absolute inset-0 bg-ds-black/70 backdrop-blur-[2px]" />
          {/* Subtle bottom-to-top gradient for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-ds-black-deepest/90 via-ds-black/40 to-ds-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 py-12 md:py-20">
        <Container>
          <h1 className="font-display text-3xl font-black tracking-tight text-ds-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ds-gray-300 md:text-lg">
              {description}
            </p>
          )}
        </Container>
      </div>
    </section>
  );
}
