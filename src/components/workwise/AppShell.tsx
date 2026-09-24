import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarClock,
  BookOpenCheck,
  MessagesSquare,
  ShieldCheck,
  Settings as SettingsIcon,
  Menu,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWorkWise } from "@/lib/workwise-store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, group: "Workspace" },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock, group: "Workspace" },
  { to: "/research", label: "AI Research Assistant", icon: BookOpenCheck, group: "Workspace" },
  { to: "/chat", label: "AI Workplace Chat", icon: MessagesSquare, group: "Workspace" },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck, group: "System" },
  { to: "/settings", label: "Settings", icon: SettingsIcon, group: "System" },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
        W
      </div>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-bold tracking-tight">WorkWise AI</p>
        <p className="text-[11px] text-muted-foreground">Productivity assistant</p>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = ["Workspace", "System"] as const;

  return (
    <nav className="flex flex-col gap-1">
      {groups.map((group) => (
        <div key={group} className="mb-2">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group}
          </p>
          {NAV.filter((item) => item.group === group).map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { settings, aiActions } = useWorkWise();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
          <div className="px-2">
            <Brand />
          </div>
          <div className="mt-8 flex-1">
            <NavLinks />
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] font-semibold">Human oversight</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              AI output is a draft. You review, verify and make the final decision.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                  aria-label="Open navigation"
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground lg:hidden"
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-sidebar p-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="px-1 pb-6 pt-1">
                    <Brand />
                  </div>
                  <NavLinks onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
              <div className="lg:hidden">
                <Brand />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
                <Sparkles className="size-3.5 text-primary" />
                {aiActions} AI actions this session
              </span>
              <div className="grid size-9 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-accent-foreground">
                {(settings.name || "A").slice(0, 1).toUpperCase()}
              </div>
            </div>
          </header>

          <main className="px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
