"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { listProjects, type ProjectListItem } from "@/lib/api";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: projects, loading, error } = useFetch<ProjectListItem[]>(() => listProjects(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your SEO analysis projects</p>
        </div>
        <a
          href="/new"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          + New Analysis
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {projects && projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6">Create your first SEO analysis to get started.</p>
          <a
            href="/new"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Project
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects?.map((project) => (
            <a
              key={project.id}
              href={`/project/${project.id}`}
              className="block bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{project.targetDomain}</h3>
                  <p className="text-sm text-muted-foreground">{project.targetUrl}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === "complete" ? "bg-green-100 text-green-700" :
                    project.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {project.progressPct > 0 && project.progressPct < 100 && (
                <div className="mt-3 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progressPct}%` }}
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
