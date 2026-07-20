export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Categories
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Manage product categories and subcategories
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-white/[0.08] bg-ds-charcoal p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-ds-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
        <p className="mt-4 text-sm text-ds-gray-500">
          Category management coming in Phase 2.
        </p>
      </div>
    </div>
  );
}
