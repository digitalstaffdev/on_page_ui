"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import { getProject, downloadPdf, downloadCsv, type Project } from "@/lib/api";

export default function ReportsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, loading } = useFetch<Project>(() => getProject(id), [id]);

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
        <h1 className="text-3xl font-bold mt-2">Reports</h1>
        <p className="text-muted-foreground mt-1">
          View and export analysis reports for {project?.targetDomain || "this project"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold">PDF Report</h3>
          <p className="text-sm text-muted-foreground mt-1">Download a comprehensive PDF report of the analysis</p>
          <a
            href={downloadPdf(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Download PDF
          </a>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold">CSV Export</h3>
          <p className="text-sm text-muted-foreground mt-1">Export keyword and analysis data as CSV</p>
          <a
            href={downloadCsv(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}
