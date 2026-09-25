import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Moon, Save, SlidersHorizontal, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/workwise/Primitives";
import { cn } from "@/lib/utils";
import { useWorkWise, type Priority, type Settings } from "@/lib/workwise-store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — WorkWise AI" },
    { name: "description", content: "Personalise your WorkWise AI profile, working hours, response style and appearance." },
    { property: "og:title", content: "Settings — WorkWise AI" },
    { property: "og:description", content: "Personalise your WorkWise AI workplace assistant." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, saveSettings } = useWorkWise();
  const [draft, setDraft] = useState<Settings>(settings);
  useEffect(() => setDraft(settings), [settings]);
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => { saveSettings(draft); toast.success("Preferences saved."); };

  return <div className="mx-auto max-w-4xl space-y-6">
    <PageHeader title="Settings" subtitle="Personalise WorkWise AI for your role, working day and preferred appearance." action={<Button className="gap-2" onClick={save}><Save className="size-4" /> Save Preferences</Button>} />
    <SettingsSection icon={UserRound} title="Profile" description="Used to personalise greetings and workplace responses."><div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><Input value={draft.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="Workplace role"><Input value={draft.role} onChange={(event) => update("role", event.target.value)} placeholder="Project Coordinator" /></Field></div></SettingsSection>
    <SettingsSection icon={Clock3} title="Working preferences" description="These times guide schedules created by the AI Task Planner."><div className="grid gap-4 sm:grid-cols-3"><Field label="Start time"><Input type="time" value={draft.workStart} onChange={(event) => update("workStart", event.target.value)} /></Field><Field label="End time"><Input type="time" value={draft.workEnd} onChange={(event) => update("workEnd", event.target.value)} /></Field><Field label="Break (minutes)"><Input type="number" min="0" max="180" value={draft.breakMinutes} onChange={(event) => update("breakMinutes", Number(event.target.value))} /></Field></div></SettingsSection>
    <SettingsSection icon={SlidersHorizontal} title="AI preferences" description="Choose your default priority and preferred answer depth."><div className="grid gap-4 sm:grid-cols-2"><Field label="Default task priority"><Select value={draft.defaultPriority} onValueChange={(value) => update("defaultPriority", value as Priority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select></Field><Field label="Response length"><Select value={draft.responseLength} onValueChange={(value) => update("responseLength", value as Settings["responseLength"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="concise">Concise</SelectItem><SelectItem value="balanced">Balanced</SelectItem><SelectItem value="detailed">Detailed</SelectItem></SelectContent></Select></Field></div></SettingsSection>
    <SettingsSection icon={Sun} title="Appearance" description="Light mode is the default; dark and system themes remain available."><div className="grid gap-3 sm:grid-cols-3">{(["light", "dark", "system"] as const).map((theme) => { const Icon = theme === "dark" ? Moon : Sun; return <Button key={theme} type="button" variant="outline" className={cn("h-auto justify-start gap-3 p-4 capitalize", draft.theme === theme && "border-primary bg-primary-soft text-accent-foreground")} onClick={() => update("theme", theme)}><Icon className="size-4" /><span><span className="block text-left font-semibold">{theme}</span><span className="block text-left text-[11px] font-normal text-muted-foreground">{theme === "system" ? "Follow this device" : `Always use ${theme}`}</span></span></Button>; })}</div></SettingsSection>
    <div className="flex justify-end"><Button className="gap-2" onClick={save}><Save className="size-4" /> Save Preferences</Button></div>
  </div>;
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: typeof Sun; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-border bg-card"><div className="flex items-start gap-3 border-b border-border p-4"><div className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></div><div><h2 className="font-display text-sm font-semibold">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div></div><div className="p-4">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }