"use client";

import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/hooks";
import { getSettings, updateSetting } from "@/lib/api";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: settings, loading, error, refetch } = useFetch<any[]>(() => getSettings(), []);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your application preferences</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">General Settings</h2>
          <p className="text-sm text-muted-foreground">
            Settings management will be available here. Configure default analysis options,
            notification preferences, and API integrations.
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">API Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage third-party API keys and integration settings for SEO data providers.
          </p>
          <a
            href="/profile/api-keys"
            className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
          >
            Manage API Keys
          </a>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Account</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile information, change your password, or manage your subscription.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="/profile" className="text-sm text-primary font-medium hover:underline">
              Edit Profile
            </a>
            <a href="/pricing" className="text-sm text-primary font-medium hover:underline">
              Manage Subscription
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
