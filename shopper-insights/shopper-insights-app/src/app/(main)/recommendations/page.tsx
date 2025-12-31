"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Wand2 } from "lucide-react";

export default function RecommendationsPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recommendations", { method: "POST" });
      const data = await response.json();
      setInsights((prev) => [...prev, data.insight]);
    } catch (error) {
      console.error("Failed to generate insight:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearInsights = () => {
    setInsights([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recommendations</h1>
        <div className="flex gap-2">
          <Button onClick={generateInsight} disabled={loading}>
            <Wand2 className="h-4 w-4 mr-2" />
            {loading ? "Generating..." : "Generate Insight"}
          </Button>
          <Button variant="destructive" onClick={clearInsights}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <p>{insight}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No recommendations yet. Click &quot;Generate Insight&quot; to get started!
          </p>
        )}
      </div>
    </div>
  );
}
