"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { getProject, runTool, type Project } from "@/lib/api";
import { useState } from "react";

const tools = [
  { name: "Site Profiler", slug: "site-profiler", description: "Crawl and analyze site structure" },
  { name: "Competitor Discovery", slug: "competitor-discovery", description: "Find top competitors via SERP overlap" },
  { name: "Keyword Extraction", slug: "keyword-extraction", description: "Extract top keywords from competitor landscape" },
  { name: "Content Gap", slug: "content-gap", description: "Identify content opportunities" },
  { name: "Page Speed", slug: "page-speed", description: "Analyze page loading performance" },
  { name: "Site Audit", slug: "site-audit", description: "Run a comprehensive SEO audit" },
  { name: "Backlinks", slug: "backlinks", description: "Analyze backlink profile" },
  { name: "Rank Tracker", slug: "rank-tracker", description: "Track keyword rankings" },
  { name: "SERP Preview", slug: "serp-preview", description: "Preview search engine result pages" },
  { name: "SERP Features", slug: "serp-features", description: "Analyze SERP feature opportunities" },
  { name: "Topic Research", slug: "topic-research", description: "Discover trending topics" },
  { name: "Internal Links", slug: "internal-links", description: "Analyze internal link structure" },
  { name: "Domain Authority", slug: "domain-authority", description: "Check domain authority score" },
  { name: "Anchor Text", slug: "anchor-text", description: "Analyze anchor text distribution" },
  { name: "Keyword Difficulty", slug: "keyword-difficulty", description: "Assess keyword competition" },
  { name: "Long-Tail Keywords", slug: "long-tail-keywords", description: "Find long-tail keyword opportunities" },
  { name: "Keyword Gap", slug: "keyword-gap", description: "Compare keyword profiles" },
  { name: "Content Performance", slug: "content-performance", description: "Evaluate content effectiveness" },
];

export default function ProjectToolsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project } = useFetch<Project>(() => getProject(id), [id]);
  const [running, setRunning] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleRun = async (slug: string) => {
    setRunning(slug);
    setMessage("");
    try {
      await runTool(slug, id);
      setMessage(`${slug} started successfully`);
    } catch (err: any) {
      setMessage(err.message || "Failed to run tool");
    } finally {
      setRunning(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <a href={`/project/${id}`} className="text-sm text-primary hover:underline">&larr; Back to Project</a>
        <h1 className="text-3xl font-bold mt-2">SEO Tools</h1>
        <p className="text-muted-foreground mt-1">
          Run analysis tools for {project?.targetDomain || "this project"}
        </p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool.slug} className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold">{tool.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
            <button
              onClick={() => handleRun(tool.slug)}
              disabled={running === tool.slug}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {running === tool.slug ? "Running..." : "Run"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
