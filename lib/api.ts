const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Auth / User APIs ──────────────────────────────────

export interface UserApiKeyItem {
  id: string;
  key_name: string;
  masked_value: string;
  is_active: boolean;
  updated_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  is_admin: boolean;
  tier: string;
  analyses_this_month: number;
  project_count: number;
  created_at: string;
  last_login: string | null;
}

export function changePassword(current_password: string, new_password: string) {
  return apiFetch<{ message: string }>("/api/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({ current_password, new_password }),
  });
}

export function updateProfile(data: { name?: string; email?: string }) {
  return apiFetch<{ message: string }>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function listMyApiKeys() {
  return apiFetch<UserApiKeyItem[]>("/api/auth/api-keys");
}

export function setMyApiKey(key_name: string, key_value: string) {
  return apiFetch<{ message: string }>("/api/auth/api-keys", {
    method: "PUT",
    body: JSON.stringify({ key_name, key_value }),
  });
}

export function deleteMyApiKey(key_name: string) {
  return apiFetch<{ message: string }>(`/api/auth/api-keys/${encodeURIComponent(key_name)}`, {
    method: "DELETE",
  });
}

export function adminListUsers() {
  return apiFetch<AdminUser[]>("/api/auth/admin/users");
}

export function adminUpdateUser(userId: string, data: { is_active?: boolean; is_admin?: boolean; tier?: string; name?: string }) {
  return apiFetch<{ message: string }>(`/api/auth/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function adminResetPassword(userId: string, new_password: string) {
  return apiFetch<{ message: string }>(`/api/auth/admin/users/${userId}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ new_password }),
  });
}

// ─── Project APIs ──────────────────────────────────────

export interface Project {
  id: string;
  targetUrl: string;
  targetDomain: string;
  status: string;
  progressPct: number;
  siteProfile: Record<string, any> | null;
  siteSummary: Record<string, any> | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ProjectListItem {
  id: string;
  targetUrl: string;
  targetDomain: string;
  status: string;
  progressPct: number;
  createdAt: string;
}

export function createProject(target_url: string, locale: string = "us") {
  return apiFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ target_url, locale }),
  });
}

export function listProjects() {
  return apiFetch<ProjectListItem[]>("/api/projects");
}

export function getProject(id: string) {
  return apiFetch<Project>(`/api/projects/${id}`);
}

export function triggerAnalysis(id: string) {
  return apiFetch<{ message: string }>(`/api/projects/${id}/pipeline`, {
    method: "POST",
  });
}

export function deleteProject(id: string) {
  return apiFetch<void>(`/api/projects/${id}`, { method: "DELETE" });
}

// ─── Competitor APIs ───────────────────────────────────

export interface Competitor {
  id: string;
  rank: number;
  domain: string;
  competitorType: string;
  relevanceScore: number;
  keywordsOverlap: Record<string, any> | null;
  notes: string | null;
  isUserAdded: boolean;
  discoveredAt: string;
}

export function listCompetitors(projectId: string) {
  return apiFetch<Competitor[]>(`/api/competitors?project_id=${projectId}`);
}

export function removeCompetitor(competitorId: string) {
  return apiFetch<void>(`/api/competitors/${competitorId}`, { method: "DELETE" });
}

export function addCompetitor(projectId: string, domain: string, notes = "") {
  return apiFetch<Competitor>("/api/competitors", {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, domain, notes }),
  });
}

// ─── Keyword APIs ──────────────────────────────────────

export interface KeywordItem {
  id: string;
  rank: number;
  keyword: string;
  cluster: string | null;
  searchIntent: string | null;
  searchVolume: number | null;
  difficulty: number | null;
  opportunityScore: number | null;
  analysisStatus: string;
  createdAt: string;
}

export function listKeywords(projectId: string) {
  return apiFetch<KeywordItem[]>(`/api/keywords?project_id=${projectId}`);
}

export function getKeyword(id: string) {
  return apiFetch<KeywordItem>(`/api/keywords/${id}`);
}

// ─── Analysis APIs ──────────────────────────────────────

export function getAnalyses(keywordId: string) {
  return apiFetch<{
    quantitative: any[];
    semantic: any[];
    rewrites: any[];
  }>(`/api/analyses?keyword_id=${keywordId}`);
}

// ─── SEO Tool APIs ─────────────────────────────────────

export function runTool(toolName: string, projectId: string, extraData?: Record<string, unknown>) {
  return apiFetch<any>(`/api/tools/${toolName}`, {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, ...extraData }),
  });
}

export function getToolResults(toolName: string, projectId: string) {
  return apiFetch<any[]>(`/api/tools/${toolName}?project_id=${projectId}`);
}

// ─── Export APIs ────────────────────────────────────────

export function downloadPdf(reportId: string) {
  return `${API_BASE}/api/exports/pdf?report_id=${reportId}`;
}

export function downloadCsv(projectId: string) {
  return `${API_BASE}/api/exports/csv?project_id=${projectId}`;
}

// ─── Settings APIs ─────────────────────────────────────

export function getSettings() {
  return apiFetch<any[]>("/api/settings");
}

export function updateSetting(key: string, value: string) {
  return apiFetch<{ message: string }>("/api/settings", {
    method: "PUT",
    body: JSON.stringify({ key, value }),
  });
}

// ─── Blog APIs ─────────────────────────────────────────

export function generateBlog(projectId: string, keyword: string, templateStyle?: string) {
  return apiFetch<any>("/api/blog/generate", {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, keyword, template_style: templateStyle }),
  });
}

export function getBlogStatus(jobId: string) {
  return apiFetch<any>(`/api/blog/status?job_id=${jobId}`);
}

// ─── Billing APIs ──────────────────────────────────────

export function getBilling() {
  return apiFetch<any>("/api/billing");
}

export function createCheckoutSession() {
  return apiFetch<{ url: string }>("/api/billing", { method: "POST" });
}
