import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Plus, Trash2, Check, Undo2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiErrorState, AiLoading, AiOutput, EmptyState } from "@/components/workwise/AiOutput";
import { HowTheAiWorks } from "@/components/workwise/HowTheAiWorks";
import { PageHeader, PriorityBadge, ResponsibleNotice, StatusBadge } from "@/components/workwise/Primitives";
import { generateSchedule } from "@/lib/ai.functions";
import { newId, parseScheduleTable, useWorkWise, type Priority } from "@/lib/workwise-store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkWise AI" },
      {
        name: "description",
        content:
          "Turn your workload into a structured, prioritised schedule with AI-generated time blocks, conflicts and productivity suggestions.",
      },
      { property: "og:title", content: "AI Task Planner — WorkWise AI" },
      {
        property: "og:description",
        content: "Turn your workload into a structured and prioritised schedule.",
      },
    ],
  }),
  component: Planner,
});

type DraftTask = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  duration: string;
  priority: Priority;
  notes: string;
};

function emptyDraft(priority: Priority): DraftTask {
  return {
    id: newId(),
    title: "",
    description: "",
    deadline: "",
    duration: "",
    priority,
    notes: "",
  };
}

function Planner() {
  const { settings, tasks, addTasks, updateTask, deleteTask, countAiAction } = useWorkWise();
  const generate = useServerFn(generateSchedule);

  const [drafts, setDrafts] = useState<DraftTask[]>([emptyDraft(settings.defaultPriority)]);
  const [workload, setWorkload] = useState("");
  const [workStart, setWorkStart] = useState(settings.workStart);
  const [workEnd, setWorkEnd] = useState(settings.workEnd);
  const [breakMinutes, setBreakMinutes] = useState(String(settings.breakMinutes));
  const [deadlines, setDeadlines] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const updateDraft = (id: string, patch: Partial<DraftTask>) =>
    setDrafts((current) => current.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const describeTasks = () =>
    drafts
      .filter((d) => d.title.trim())
      .map(
        (d, i) =>
          `${i + 1}. ${d.title.trim()}${d.description ? ` — ${d.description.trim()}` : ""}` +
          ` | deadline: ${d.deadline || "not specified"}` +
          ` | estimated duration: ${d.duration ? `${d.duration} minutes` : "not specified"}` +
          ` | priority: ${d.priority}` +
          (d.notes ? ` | notes: ${d.notes.trim()}` : ""),
      )
      .join("\n");

  const onGenerate = async () => {
    const structured = describeTasks();
    if (!structured && !workload.trim()) {
      setError("Please provide some information before continuing.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { text } = await generate({
        data: {
          workload,
          tasks: structured,
          workStart,
          workEnd,
          breakMinutes: Number(breakMinutes) || 0,
          deadlines,
          length: settings.responseLength,
        },
      });
      setResult(text);
      countAiAction();
      const parsed = parseScheduleTable(text);
      if (parsed.length) {
        addTasks(parsed);
        toast.success(`${parsed.length} scheduled items added to your day.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't generate a response right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Task Planner"
        subtitle="Turn your workload into a structured and prioritised schedule."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-sm font-semibold">Your tasks</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setDrafts((c) => [...c, emptyDraft(settings.defaultPriority)])}
              >
                <Plus className="size-3.5" /> Add task
              </Button>
            </div>
            <div className="space-y-4 p-4">
              {drafts.map((draft, index) => (
                <div key={draft.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Task {index + 1}</p>
                    {drafts.length > 1 ? (
                      <button
                        onClick={() => setDrafts((c) => c.filter((d) => d.id !== draft.id))}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove task"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Task name</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="Finish the monthly report"
                        value={draft.title}
                        onChange={(e) => updateDraft(draft.id, { title: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        className="mt-1.5 min-h-16"
                        placeholder="What does this task involve?"
                        value={draft.description}
                        onChange={(e) => updateDraft(draft.id, { description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Deadline</Label>
                      <Input
                        type="date"
                        className="mt-1.5"
                        value={draft.deadline}
                        onChange={(e) => updateDraft(draft.id, { deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Estimated duration (minutes)</Label>
                      <Input
                        type="number"
                        min="5"
                        className="mt-1.5"
                        placeholder="45"
                        value={draft.duration}
                        onChange={(e) => updateDraft(draft.id, { duration: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Select
                        value={draft.priority}
                        onValueChange={(v) => updateDraft(draft.id, { priority: v as Priority })}
                      >
                        <SelectTrigger className="mt-1.5 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Optional notes</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="Needs manager sign-off"
                        value={draft.notes}
                        onChange={(e) => updateDraft(draft.id, { notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold">Working preferences</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Working start time</Label>
                <Input
                  type="time"
                  className="mt-1.5"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Working end time</Label>
                <Input
                  type="time"
                  className="mt-1.5"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Break duration (minutes)</Label>
                <Input
                  type="number"
                  min="0"
                  className="mt-1.5"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <Label className="text-xs">Important deadlines</Label>
                <Input
                  className="mt-1.5"
                  placeholder="Client report due 16:00 today"
                  value={deadlines}
                  onChange={(e) => setDeadlines(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold">What do you need to accomplish?</h2>
            <Textarea
              className="mt-3 min-h-32"
              placeholder="Finish the monthly report, prepare for the team meeting, respond to client emails, analyse sales data and complete my presentation."
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
            />
            <Button onClick={onGenerate} disabled={loading} className="mt-3 w-full gap-2 sm:w-auto">
              <Sparkles className="size-4" />
              {loading ? "Generating..." : "Generate AI Schedule"}
            </Button>
          </section>
        </div>

        <div className="space-y-4">
          {loading ? <AiLoading label="AI is building your schedule..." /> : null}
          {error ? <AiErrorState message={error} /> : null}
          {result ? <AiOutput title="AI Schedule & Prioritisation" text={result} /> : null}
          {!loading && !error && !result ? (
            <EmptyState
              title="No AI schedule yet"
              description="Add your tasks or describe your workload, then generate a schedule with prioritisation, conflicts, productivity suggestions and any tasks to postpone."
            />
          ) : null}

          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 className="font-display text-sm font-semibold">Your schedule</h2>
                <p className="text-xs text-muted-foreground">Daily progress</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {completed} of {tasks.length} tasks completed
                </span>
                <Progress value={percent} className="h-2 w-24" />
              </div>
            </div>
            {tasks.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="Your day is empty"
                  description="Generated schedule items appear here, where you can complete, edit, re-prioritise or remove them."
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tasks.map((task) => (
                  <div key={task.id} className="flex flex-wrap items-center gap-2 px-4 py-3">
                    <span className="w-14 shrink-0 font-mono text-[13px] text-muted-foreground">
                      {task.time}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-sm font-medium ${
                        task.status === "Completed" ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    <span className="font-mono text-[12px] text-muted-foreground">
                      {task.duration}
                    </span>
                    <StatusBadge status={task.status} />
                    <div className="flex items-center gap-1">
                      <Select
                        value={task.priority}
                        onValueChange={(v) => updateTask(task.id, { priority: v as Priority })}
                      >
                        <SelectTrigger
                          className="h-8 w-8 justify-center p-0 [&>svg:last-child]:hidden"
                          aria-label="Change priority"
                        >
                          <Pencil className="size-3.5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High priority</SelectItem>
                          <SelectItem value="Medium">Medium priority</SelectItem>
                          <SelectItem value="Low">Low priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={task.status === "Completed" ? "Mark pending" : "Complete task"}
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === "Completed" ? "Pending" : "Completed",
                          })
                        }
                      >
                        {task.status === "Completed" ? (
                          <Undo2 className="size-3.5" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        aria-label="Delete task"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <HowTheAiWorks />
      <ResponsibleNotice />
    </div>
  );
}
