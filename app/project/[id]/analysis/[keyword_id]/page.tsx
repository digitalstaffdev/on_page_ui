"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { getKeyword, getAnalyses, type KeywordItem } from "@/lib/api";

export default function KeywordAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const keywordId = params.keyword_id as string;

  const { data: keyword, loading: kwLoading } = useFetch<KeywordItem>(() => getKeyword(keywordId), [keywordId]);
  const { data: analyses, loading: anLoading, error } = useFetch(
    () => getAnalyses(keywordId),
    [keywordId]
  );

  const loading = kwLoading || anLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <a href={`/project/${projectId}/deep-analysis`} className="text-sm text-primary hover:underline">&larr; Back to Deep Analysis</a>
        <h1 className="text-3xl font-bold mt-2">{keyword?.keyword || "Keyword Analysis"}</h1>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          {keyword?.cluster && <span>Cluster: {keyword.cluster}</span>}
          {keyword?.searchIntent && <span>Intent: {keyword.searchIntent}</span>}
          {keyword?.searchVolume != null && <span>Volume: {keyword.searchVolume.toLocaleString()}</span>}
          {keyword?.difficulty != null && <span>Difficulty: {keyword.difficulty}</span>}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Quantitative Results</p>
          <p className="text-2xl font-bold">{analyses?.quantitative?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Semantic Results</p>
          <p className="text-2xl font-bold">{analyses?.semantic?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Rewrites</p>
          <p className="text-2xl font-bold">{analyses?.rewrites?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Analysis Details</h2>
        <p className="text-sm text-muted-foreground">
          Detailed quantitative, semantic, and rewrite analysis results will be displayed here.
          Select a specific analysis to view in-depth metrics, recommendations, and AI-generated content suggestions.
        </p>
      </div>
    </div>
  );
}
