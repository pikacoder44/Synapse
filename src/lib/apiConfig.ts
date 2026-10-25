/**
 * Resolves the base URL for Synapse backend API calls.
 *
 * In production multi-service deployment on Vercel, requests to /api/* are
 * automatically routed directly to the Express backend service on the same domain.
 *
 * Therefore, when VITE_API_BASE_URL (or legacy VITE_API_URL) is undefined or empty,
 * this returns an empty string "", ensuring all frontend requests use relative
 * /api/* paths (e.g. /api/scores) without CORS issues.
 */
export function getApiBase(): string {
  const envUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ""
  ).trim();

  if (!envUrl) {
    return "";
  }

  // Normalize by removing any trailing slash or redundant /api suffix
  const trimmed = envUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}

export const API_BASE = getApiBase();
