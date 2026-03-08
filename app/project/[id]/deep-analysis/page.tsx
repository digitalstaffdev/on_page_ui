"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { listKeywords, type KeywordItem, getProject, type Project } from "@/lib/api";

export default function DeepAnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project } = useFetch<Project>(() => getProject(id), [id]);
  const { data: keywords, loading, error } = useFetch<KeywordItem[]>(() => listKeywords(id), [id]);

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
        <a href={`/project/${id}`} className="text-sm text-primary hover:underline">&larr; Back to Project</a>
        <h1 className="text-3xl font-bold mt-2">Deep Analysis</h1>
        <p className="text-muted-foreground mt-1">
          In-depth content analysis for {project?.targetDomain || "this project"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {keywords && keywords.length > 0 ? (
        <div className="space-y-3">
          {keywords.map((kw) => (
            <a
              key={kw.id}
              href={`/project/${id}/analysis/${kw.id}`}
              className="block bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{kw.keyword}</h3>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    {kw.cluster && <span>Cluster: {kw.cluster}</span>}
                    {kw.searchIntent && <span>Intent: {kw.searchIntent}</span>}
                    {kw.searchVolume != null && <span>Volume: {kw.searchVolume.toLocaleString()}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  kw.analysisStatus === "complete" ? "bg-green-100 text-green-700" :
                  kw.analysisStatus === "failed" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {kw.analysisStatus}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border">
          <h2 className="text-xl font-semibold mb-2">No keywords yet</h2>
          <p className="text-muted-foreground">Run the discovery pipeline first to generate keywords.</p>
        </div>
      )}
    </div>
  );
}
