"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { listCompetitors, type Competitor } from "@/lib/api";

export default function CompetitorDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const competitorId = params.competitorId as string;

  const { data: competitors, loading, error } = useFetch<Competitor[]>(
    () => listCompetitors(projectId),
    [projectId]
  );

  const competitor = competitors?.find((c) => c.id === competitorId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !competitor) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error || "Competitor not found"}</p>
        <a href={`/project/${projectId}`} className="text-sm text-primary hover:underline mt-4 inline-block">
          Back to Project
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <a href={`/project/${projectId}`} className="text-sm text-primary hover:underline">&larr; Back to Project</a>
        <h1 className="text-3xl font-bold mt-2">{competitor.domain}</h1>
        <p className="text-muted-foreground mt-1">
          Rank #{competitor.rank} &middot; {competitor.competitorType} competitor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Relevance Score</p>
          <p className="text-2xl font-bold">{(competitor.relevanceScore * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Type</p>
          <p className="text-lg font-semibold capitalize">{competitor.competitorType}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Discovered</p>
          <p className="text-lg font-semibold">{new Date(competitor.discoveredAt).toLocaleDateString()}</p>
        </div>
      </div>

      {competitor.notes && (
        <div className="bg-white rounded-xl border p-6 mb-4">
          <h2 className="font-semibold mb-2">Notes</h2>
          <p className="text-sm text-muted-foreground">{competitor.notes}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Keyword Overlap</h2>
        <p className="text-sm text-muted-foreground">
          Detailed keyword overlap analysis and competitive intelligence will be displayed here.
        </p>
      </div>
    </div>
  );
}
