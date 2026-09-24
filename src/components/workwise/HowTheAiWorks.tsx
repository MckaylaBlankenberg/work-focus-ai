import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LAYERS = [
  ["Role", "Who the AI should act as — for example a professional workplace productivity assistant."],
  ["Context", "The user's real inputs: tasks, deadlines, working hours, notes or supplied source text."],
  ["Task", "The single job to perform, such as building a realistic prioritised schedule."],
  ["Constraints", "Rules the output must respect: no overlapping tasks, no invented facts, respect working hours, include breaks."],
  ["Output Format", "The exact structure requested, so results are consistent and easy to read."],
  ["Validation", "Checks built into the prompt: flag unrealistic workloads, conflicts and anything needing user confirmation."],
] as const;

export function HowTheAiWorks() {
  return (
    <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
      <AccordionItem value="how" className="border-none">
        <AccordionTrigger className="font-display text-sm font-semibold">
          How the AI Works
        </AccordionTrigger>
        <AccordionContent className="space-y-5 pb-5 text-sm text-muted-foreground">
          <p>
            WorkWise AI does not send raw one-line questions to the model. Every feature uses a
            structured prompt built from six layers:
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {LAYERS.map(([name, description]) => (
              <div key={name} className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-semibold text-foreground">{name}</p>
                <p className="mt-1 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-semibold text-foreground">Example prompt structure</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li>
                <span className="font-semibold text-foreground">Role:</span> Professional workplace
                productivity assistant.
              </li>
              <li>
                <span className="font-semibold text-foreground">Context:</span> User's tasks,
                deadlines and working hours.
              </li>
              <li>
                <span className="font-semibold text-foreground">Task:</span> Create a realistic
                schedule.
              </li>
              <li>
                <span className="font-semibold text-foreground">Constraints:</span> Avoid
                overlapping tasks, respect working hours and include breaks.
              </li>
              <li>
                <span className="font-semibold text-foreground">Output:</span> Structured schedule
                with prioritisation reasoning and conflicts.
              </li>
              <li>
                <span className="font-semibold text-foreground">Validation:</span> Identify
                unrealistic workloads and information requiring user confirmation.
              </li>
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-semibold text-foreground">Basic prompt</p>
              <p className="mt-1.5 text-xs italic">"Plan my day."</p>
            </div>
            <div className="rounded-lg border border-primary/40 bg-primary-soft/40 p-4">
              <p className="text-xs font-semibold text-foreground">Improved prompt</p>
              <p className="mt-1.5 text-xs italic">
                "Act as a workplace productivity assistant. Organise the following tasks according
                to urgency, importance, deadlines and estimated duration. Respect my working hours,
                avoid overlapping tasks, include reasonable breaks and identify tasks that cannot
                realistically fit into the day."
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground">
              Why the improved prompt is better
            </p>
            <ul className="mt-1.5 grid gap-1 text-xs sm:grid-cols-2">
              <li>• Provides a clear role</li>
              <li>• Provides context</li>
              <li>• Defines the task</li>
              <li>• Adds constraints</li>
              <li>• Specifies the desired output</li>
              <li>• Reduces ambiguity</li>
            </ul>
          </div>

          <p className="text-xs">
            Prompts, model configuration and credentials stay on the server. No API keys are exposed
            in the browser.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
