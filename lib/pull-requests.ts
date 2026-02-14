const GITHUB_PR_URL_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/pull\/\d+$/;

export function isValidGitHubPrUrl(url: string): boolean {
  return GITHUB_PR_URL_REGEX.test(url.trim());
}

export function normalizePullRequests(input: {
  pullRequest?: string;
  pullRequests?: string[];
}): { pullRequests?: string[]; error?: string } {
  const urls = new Set<string>();

  if (input.pullRequest && typeof input.pullRequest === "string") {
    urls.add(input.pullRequest.trim());
  }

  if (Array.isArray(input.pullRequests)) {
    for (const url of input.pullRequests) {
      if (typeof url === "string") {
        urls.add(url.trim());
      }
    }
  }

  if (urls.size === 0) return {};

  for (const url of urls) {
    if (!isValidGitHubPrUrl(url)) {
      return {
        error:
          "Pull request URLs must match format: https://github.com/{owner}/{repo}/pull/{number}",
      };
    }
  }

  return { pullRequests: Array.from(urls) };
}
