"use client";

import { useSession } from "next-auth/react";
import { getBilling, createCheckoutSession } from "@/lib/api";
import { useState } from "react";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession();
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: ["3 projects", "Basic analysis", "Community support"],
      current: true,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      features: ["Unlimited projects", "Deep analysis", "Priority support", "Export reports", "API access"],
      current: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Everything in Pro", "Dedicated support", "Custom integrations", "SLA guarantee"],
      current: false,
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground mt-2">Choose the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-xl border p-6 ${plan.name === "Pro" ? "ring-2 ring-primary shadow-lg" : ""}`}>
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={plan.name === "Pro" ? handleUpgrade : undefined}
              disabled={plan.current || loading}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                plan.name === "Pro"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border hover:bg-muted"
              } disabled:opacity-50`}
            >
              {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Us" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
