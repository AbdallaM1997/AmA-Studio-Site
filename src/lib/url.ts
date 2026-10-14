/**
 * Prefix a site path with the deploy base (e.g. "/AmA-Studio-Site" on GitHub Pages).
 * Use for every internal link and every /images/... or /videos/... path.
 * Full URLs, mailto:, and empty strings pass through unchanged.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string;
export function url(path: string | undefined | null): string | undefined | null;
export function url(path: string | undefined | null) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  return base + path;
}
