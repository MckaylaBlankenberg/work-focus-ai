import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiErrorState, AiLoading, AiOutput, EmptyState } from "@/components/workwise/AiOutput";
import { HowTheAiWorks } from "@/components/workwise/HowTheAiWorks";
import { PageHeader, ResponsibleNotice } from "@/components/workwise/Primitives";
import { runResearch } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";
import { useWorkWise } from "@/lib/workwise-store";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkWise AI" },
      {
        name: "description",
        content:
          "Summarise, explain and extract insights, recommendations and action points from workplace information with AI.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkWise AI" },
      {
        property: "og:description",
        content: "Understand information faster with AI-powered research assistance.",
      },
    ],
  }),
  component: Research,
});

const MODES = [
  { id: "summarise", label: "Summarise", hint: "Create a concise summary" },
  { id: "explain", label: "Explain", hint: "Plain-language explanation" },
  { id: "insights", label: "Key Insights", hint: "Extract important findings" },
  { id: "recommendations", label: "Recommendations", hint: "Practical recommendations" },
  { id: "questions", label: "Questions", hint: "Follow-up research questions" },
  { id: "actions", label: "Action Points", hint: "Turn info into workplace actions" },
] as const;

type Mode = (typeof MODES)[number]["id"];

function Research() {
  const { settings, countAiAction } = useWorkWise();
  const research = useServerFn(runResearch);

  const [mode, setMode] = useState<Mode>("summarise");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const onRun = async () => {
    if (!content.trim()) {
      setError("Please provide some information before continuing.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { text } = await research({
        data: { mode, content, length: settings.responseLength },
      });
      setResult(text);
      countAiAction();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We couldn't generate a response right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Understand information faster with AI-powered research assistance."
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground">Research mode</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                mode === m.id
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{m.hint}</p>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground">
            Paste a topic, article, report, notes or a question
          </p>
          <Textarea
            className="mt-2 min-h-44"
            placeholder="Paste the article, report, meeting notes or workplace information you want to understand — or type a question."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={onRun} disabled={loading} className="gap-2">
            <Sparkles className="size-4" />
            {loading ? "Analysing..." : "Run AI Research"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            WorkWise AI has no internet or database access. It analyses only what you supply.
          </p>
        </div>
      </div>

      {loading ? <AiLoading /> : null}
      {error ? <AiErrorState message={error} /> : null}
      {result ? (
        <AiOutput
          title={`Research result — ${MODES.find((m) => m.id === mode)?.label}`}
          text={result}
          footer="AI-generated research assistance should be reviewed and verified before being used for important workplace decisions."
        />
      ) : null}
      {!loading && !error && !result ? (
        <EmptyState
          title="Nothing analysed yet"
          description="Choose a research mode, paste your information and WorkWise AI will structure it into summaries, insights, recommendations or action points."
        />
      ) : null}

      <HowTheAiWorks />
      <ResponsibleNotice />
    </div>
  );
}
