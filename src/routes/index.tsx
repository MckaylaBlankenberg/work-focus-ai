import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  CalendarClock,
  BookOpenCheck,
  MessagesSquare,
  Mail,
  FileText,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { PageHeader, PriorityBadge, StatusBadge, ResponsibleNotice } from "@/components/workwise/Primitives";
import { HowTheAiWorks } from "@/components/workwise/HowTheAiWorks";
import { EmptyState } from "@/components/workwise/AiOutput";
import { useWorkWise } from "@/lib/workwise-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkWise AI" },
      {
        name: "description",
        content:
          "See today's tasks, priorities, progress and quick AI actions in the WorkWise AI workplace dashboard.",
      },
      { property: "og:title", content: "WorkWise AI Dashboard" },
      {
        property: "og:description",
        content: "Today's schedule, priorities and quick AI actions in one workplace view.",
      },
    ],
  }),
  component: Dashboard,
});

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  { label: "Plan My Day", hint: "Build a schedule", to: "/planner", icon: CalendarClock, search: undefined },
  { label: "Research a Topic", hint: "Summarise & insights", to: "/research", icon: BookOpenCheck, search: undefined },
  { label: "Ask AI", hint: "Workplace chat", to: "/chat", icon: MessagesSquare, search: { mode: "chat" as const } },
  { label: "Write an Email", hint: "Professional draft", to: "/chat", icon: Mail, search: { mode: "email" as const } },
  { label: "Summarise Meeting", hint: "Notes to actions", to: "/chat", icon: FileText, search: { mode: "meeting" as const } },
];

function Dashboard() {
  const { tasks, settings, aiActions, hydrated } = useWorkWise();

  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const highPriority = tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const metrics = [
    { label: "Today's Tasks", value: total, hint: "planned for today", icon: ListChecks, tone: "text-primary" },
    { label: "High Priority", value: highPriority, hint: "need attention", icon: AlertTriangle, tone: "text-high" },
    { label: "Completed", value: completed, hint: `of ${total} tasks`, icon: CheckCircle2, tone: "text-done" },
    { label: "AI Assistance", value: aiActions, hint: "actions this session", icon: Sparkles, tone: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting(now.getHours())}, ${settings.name || "there"}`}
        subtitle={`Let's make today productive. · ${now.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <Icon className={`size-4 ${m.tone}`} />
              </div>
              <p className="mt-3 font-display text-3xl font-bold tracking-tight">{m.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{m.hint}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">Today's Schedule</h2>
            <p className="text-xs text-muted-foreground">
              Prioritised by urgency, importance and deadline
            </p>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <span className="text-xs text-muted-foreground">
              {completed} of {total} tasks completed
            </span>
            <Progress value={percent} className="h-2 w-28" />
          </div>
        </div>

        {!hydrated ? null : total === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No tasks yet"
              description="Use the AI Task Planner to turn your workload into a structured, prioritised schedule."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-3 py-3 font-semibold">Task</th>
                  <th className="px-3 py-3 font-semibold">Priority</th>
                  <th className="px-3 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map((task) => (
                  <tr key={task.id} className="transition-colors hover:bg-secondary/50">
                    <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">
                      {task.time}
                    </td>
                    <td className="px-3 py-3 font-medium">{task.title}</td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-3 py-3 font-mono text-[13px] text-muted-foreground">
                      {task.duration}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Quick AI Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                search={action.search}
                className="group rounded-xl border border-border bg-card px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <Icon className="size-4 text-primary" />
                <p className="mt-2.5 text-sm font-semibold group-hover:text-primary">
                  {action.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{action.hint}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <HowTheAiWorks />
      <ResponsibleNotice />
    </div>
  );
}
