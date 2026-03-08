"use client";

import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/hooks";
import { listMyApiKeys, setMyApiKey, deleteMyApiKey, type UserApiKeyItem } from "@/lib/api";
import { useState } from "react";

export default function ApiKeysPage() {
  const { data: session } = useSession();
  const { data: keys, loading, error, refetch } = useFetch<UserApiKeyItem[]>(() => listMyApiKeys(), []);
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await setMyApiKey(keyName, keyValue);
      setKeyName("");
      setKeyValue("");
      setMessage("API key saved successfully");
      refetch();
    } catch (err: any) {
      setMessage(err.message || "Failed to save key");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete API key "${name}"?`)) return;
    try {
      await deleteMyApiKey(name);
      refetch();
    } catch {
      // silently handle
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground mt-1">Manage your third-party API keys for SEO data providers</p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
      )}

      <form onSubmit={handleAdd} className="bg-white rounded-xl border p-6 space-y-4 mb-6">
        <h2 className="font-semibold">Add / Update API Key</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Key Name</label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            placeholder="e.g. serpapi, dataforseo"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Key Value</label>
          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            placeholder="Your API key"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Key"}
        </button>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Your API Keys</h2>
        </div>
        {keys && keys.length > 0 ? (
          <div className="divide-y">
            {keys.map((key) => (
              <div key={key.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{key.key_name}</p>
                  <p className="text-xs text-muted-foreground">{key.masked_value}</p>
                </div>
                <button
                  onClick={() => handleDelete(key.key_name)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No API keys configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
