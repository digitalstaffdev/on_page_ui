"use client";

import { useParams } from "next/navigation";
import { useFetch, useProjectProgress } from "@/lib/hooks";
import { getProject, type Project } from "@/lib/api";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, loading, error, refetch } = useFetch<Project>(() => getProject(id), [id]);
  const progress = useProjectProgress(
    project && !["complete", "failed", "ready"].includes(project.status) ? id : null
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return <div className="text-center py-16 text-red-500">{error || "Project not found"}</div>;
  }

  const displayStatus = progress?.status || project.status;
  const displayProgress = progress?.progressPct ?? project.progressPct;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{project.targetDomain}</h1>
        <p className="text-muted-foreground">{project.targetUrl}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-lg font-semibold capitalize">{displayStatus}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-lg font-semibold">{displayProgress}%</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="text-lg font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {displayProgress > 0 && displayProgress < 100 && (
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href={`/project/${id}/tools`} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold">SEO Tools</h3>
          <p className="text-sm text-muted-foreground mt-1">Run analysis tools on this project</p>
        </a>
        <a href={`/project/${id}/reports`} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold">Reports</h3>
          <p className="text-sm text-muted-foreground mt-1">View generated reports</p>
        </a>
        <a href={`/project/${id}/deep-analysis`} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold">Deep Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">In-depth content analysis</p>
        </a>
      </div>
    </div>
  );
}
