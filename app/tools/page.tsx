"use client";

import { useSession } from "next-auth/react";

const tools = [
  { name: "Site Profiler", slug: "site-profiler", description: "Analyze site structure and content" },
  { name: "Competitor Discovery", slug: "competitor-discovery", description: "Find top competitors in your niche" },
  { name: "Keyword Extraction", slug: "keyword-extraction", description: "Extract high-value keywords" },
  { name: "Content Gap Analysis", slug: "content-gap", description: "Find content opportunities" },
  { name: "Page Speed", slug: "page-speed", description: "Analyze page loading performance" },
  { name: "Site Audit", slug: "site-audit", description: "Comprehensive SEO site audit" },
  { name: "Backlink Analysis", slug: "backlinks", description: "Analyze your backlink profile" },
  { name: "Rank Tracker", slug: "rank-tracker", description: "Track keyword rankings over time" },
  { name: "SERP Preview", slug: "serp-preview", description: "Preview how pages appear in search" },
  { name: "Topic Research", slug: "topic-research", description: "Discover trending topics" },
  { name: "Internal Links", slug: "internal-links", description: "Analyze internal link structure" },
  { name: "Domain Authority", slug: "domain-authority", description: "Check domain authority scores" },
];

export default function ToolsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">SEO Tools</h1>
        <p className="text-muted-foreground mt-1">
          Select a project first, then run these tools from the project page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.slug}
            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{tool.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
            <a
              href="/dashboard"
              className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
            >
              Select a project to use
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
