import { defineTool } from "eve/tools";
import { z } from "zod";

interface SearxResult {
  title?: string;
  url?: string;
  content?: string;
}

function isSearxResponse(v: unknown): v is { results?: SearxResult[] } {
  return typeof v === "object" && v !== null;
}

/** Sovereign web search: calls a self-hosted SearXNG instance. Set SEARXNG_URL in env. */
export default defineTool({
  description:
    "Search the web for current information. Use for news, documentation, or anything that may have changed recently.",
  inputSchema: z.object({
    query: z.string().describe("The search query."),
  }),
  async execute({ query }) {
    const base = process.env.SEARXNG_URL ?? "http://localhost:8080";
    const url = new URL("/search", base);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("categories", "general");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`SearXNG returned ${res.status}: ${res.statusText}`);
    }

    const json: unknown = await res.json();
    if (!isSearxResponse(json)) {
      throw new Error("Unexpected response from SearXNG");
    }

    const results = (json.results ?? []).slice(0, 8).map((r) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.content ?? "",
    }));

    return { query, results };
  },
});
