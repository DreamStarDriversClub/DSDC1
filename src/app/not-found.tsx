export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ds-black">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black text-ds-white">
          Wrong Turn on the Touge
        </h1>
        <p className="mt-4 text-ds-gray-300">
          This page doesn&apos;t exist. The road goes on.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white"
        >
          Back to the Garage
        </a>
      </div>
    </div>
  )
}
