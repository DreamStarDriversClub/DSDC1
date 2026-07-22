import { Container } from "@/components/ui/Container";

interface CategoryHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

export function CategoryHeader({ title, description, image }: CategoryHeaderProps) {
  return (
    <section className="border-b border-white/[0.06] bg-ds-black-deepest py-12 md:py-16">
      <Container>
        <h1 className="font-display text-3xl font-black tracking-tight text-ds-white md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-ds-gray-400">{description}</p>
        )}
      </Container>
    </section>
  );
}
