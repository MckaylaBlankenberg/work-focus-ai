import { createFileRoute } from "@tanstack/react-router";
import { Eye, LockKeyhole, Scale, SearchCheck, ShieldCheck, UserCheck } from "lucide-react";

import { PageHeader, ResponsibleNotice } from "@/components/workwise/Primitives";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({ meta: [
    { title: "Responsible AI — WorkWise AI" },
    { name: "description", content: "Understand WorkWise AI's commitments to human oversight, accuracy, privacy, fairness and transparent use." },
    { property: "og:title", content: "Responsible AI — WorkWise AI" },
    { property: "og:description", content: "Practical principles for safe, transparent and human-led workplace AI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResponsibleAi,
});

const PRINCIPLES = [
  { title: "Human Oversight", icon: UserCheck, text: "AI output supports people; it does not replace professional judgement. Review every draft before acting on it." },
  { title: "Accuracy and Limitations", icon: SearchCheck, text: "AI can misunderstand context or produce incorrect information. Verify facts, figures, names, dates and sources." },
  { title: "Privacy", icon: LockKeyhole, text: "Avoid entering passwords, personal records, confidential client information or commercially sensitive material." },
  { title: "Bias", icon: Scale, text: "AI output can reflect bias in its training data. Consider different perspectives and check for unfair assumptions." },
  { title: "Transparency", icon: Eye, text: "WorkWise identifies AI-generated content and does not claim internet access, human identity or completed external actions." },
  { title: "Appropriate Use", icon: ShieldCheck, text: "Do not rely on WorkWise for legal, medical, financial, hiring or other high-stakes decisions without qualified review." },
];

function ResponsibleAi() {
  return <div className="space-y-6">
    <PageHeader title="Responsible AI" subtitle="Clear safeguards for using AI thoughtfully and professionally at work." />
    <div className="rounded-xl border border-primary/30 bg-primary-soft p-5 sm:p-6"><ResponsibleNotice className="border-0 bg-transparent p-0" /></div>
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {PRINCIPLES.map(({ title, icon: Icon, text }) => <article key={title} className="rounded-xl border border-border bg-card p-5"><div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></div><h2 className="mt-4 font-display text-base font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
    </section>
    <section className="border-t border-border pt-6"><h2 className="font-display text-lg font-semibold">Before using an AI response</h2><ol className="mt-4 grid gap-3 sm:grid-cols-3">{["Check the response against the information you supplied.", "Verify important claims with trusted and current sources.", "Make the final decision yourself or involve an appropriate expert."].map((item, index) => <li key={item} className="flex gap-3 text-sm text-muted-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ol></section>
  </div>;
}