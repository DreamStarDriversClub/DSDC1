import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ds-black px-4 text-center">
      <h1 className="font-display text-8xl font-black tracking-tight text-ds-red">
        404
      </h1>
      <p className="mt-4 text-xl text-ds-gray-300">
        Page not found
      </p>
      <p className="mt-2 text-sm text-ds-gray-500">
        The road you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ds-red-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
