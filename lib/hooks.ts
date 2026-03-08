"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useProjectProgress(projectId: string | null, intervalMs: number = 3000) {
  const [progress, setProgress] = useState<{
    status: string;
    progressPct: number;
    message?: string;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProgress({
            status: data.status,
            progressPct: data.progressPct,
          });

          if (data.status === "complete" || data.status === "failed" || data.status === "ready") {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      } catch {
        // Silently retry
      }
    };

    poll();
    intervalRef.current = setInterval(poll, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [projectId, intervalMs]);

  return progress;
}
