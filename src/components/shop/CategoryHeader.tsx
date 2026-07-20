interface CategoryHeaderProps {
  title: string;
  description?: string | null;
  image?: string | null;
  fallbackImage?: string;
}

export function CategoryHeader({
  title,
  description,
  image,
  fallbackImage,
}: CategoryHeaderProps) {
  const bgImage = image || fallbackImage;

  return (
    <section className="relative overflow-hidden bg-ds-black-deepest">
      {/* Background image */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ds-black via-ds-black/70 to-ds-black/40" />
      <div className="absolute inset-0 bg-hero-glow" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
          {description && (
            <p className="mt-6 text-lg leading-relaxed text-ds-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
    </section>
  );
}
