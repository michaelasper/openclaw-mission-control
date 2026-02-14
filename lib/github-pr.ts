export function isGitHubPullRequestUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname.toLowerCase() !== "github.com") return false;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 4) return false;
    if (parts[2] !== "pull") return false;

    return /^\d+$/.test(parts[3]);
  } catch {
    return false;
  }
}
