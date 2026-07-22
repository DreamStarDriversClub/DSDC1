/**
 * Image path utilities — normalizes product image paths to WebP format.
 * Original files are still on disk as fallbacks; we prefer .webp for
 * browsers that support it (every modern browser does).
 */

/**
 * Convert a .jpg/.jpeg/.png image path to the .webp equivalent.
 * Leaves other paths (external URLs, already .webp) unchanged.
 */
export function toWebpPath(path: string | null | undefined): string {
  if (!path) return "";
  // External URLs — pass through unchanged
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Already WebP — pass through
  if (path.endsWith(".webp")) return path;
  // Strip .jpg/.jpeg/.png extension and append .webp
  return path.replace(/\.(jpe?g|png)$/i, ".webp");
}
