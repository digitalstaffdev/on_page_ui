"use client";

import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/hooks";
import { adminListUsers, type AdminUser } from "@/lib/api";

export default function AdminPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { data: users, loading, error, refetch } = useFetch<AdminUser[]>(() => adminListUsers(), []);

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have admin privileges.</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground mt-1">Manage users and system settings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Users ({users?.length || 0})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-sm">{u.name || "—"}</td>
                  <td className="px-6 py-4 text-sm capitalize">{u.tier}</td>
                  <td className="px-6 py-4 text-sm">{u.project_count}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
