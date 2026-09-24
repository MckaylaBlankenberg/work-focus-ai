import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AiError, callWorkWiseAi } from "./ai-gateway.server";
import {
  ACTION_ITEMS_SYSTEM_PROMPT,
  AGENDA_SYSTEM_PROMPT,
  EMAIL_SYSTEM_PROMPT,
  MEETING_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  RESEARCH_SYSTEM_PROMPT,
  chatSystemPrompt,
  emailPrompt,
  plannerPrompt,
  researchPrompt,
} from "./prompts.server";

const lengthSchema = z.enum(["concise", "balanced", "detailed"]).default("balanced");

const FRIENDLY_FALLBACK = "We couldn't generate a response right now. Please try again.";

async function run(fn: () => Promise<string>): Promise<{ text: string }> {
  try {
    return { text: await fn() };
  } catch (error) {
    if (error instanceof AiError) throw new Error(error.message);
    console.error("WorkWise AI failure", error);
    throw new Error(FRIENDLY_FALLBACK);
  }
}

/* ------------------------------ Task planner ------------------------------ */

const PlannerInput = z.object({
  workload: z.string().default(""),
  tasks: z.string().default(""),
  workStart: z.string().default("09:00"),
  workEnd: z.string().default("17:00"),
  breakMinutes: z.number().int().min(0).max(180).default(30),
  deadlines: z.string().default(""),
  length: lengthSchema,
});

export const generateSchedule = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlannerInput.parse(data))
  .handler(async ({ data }) => {
    if (!data.workload.trim() && !data.tasks.trim()) {
      throw new Error("Please provide some information before continuing.");
    }
    return run(() =>
      callWorkWiseAi({
        system: PLANNER_SYSTEM_PROMPT,
        prompt: plannerPrompt(data),
        effort: "medium",
      }),
    );
  });

/* ---------------------------- Research assistant --------------------------- */

const ResearchInput = z.object({
  mode: z.enum(["summarise", "explain", "insights", "recommendations", "questions", "actions"]),
  content: z.string().min(1, "Please provide some information before continuing."),
  length: lengthSchema,
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ResearchInput.parse(data))
  .handler(async ({ data }) =>
    run(() =>
      callWorkWiseAi({
        system: RESEARCH_SYSTEM_PROMPT,
        prompt: researchPrompt(data),
        effort: "low",
      }),
    ),
  );

/* -------------------------------- Chat ------------------------------------ */

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
  length: lengthSchema,
  userRole: z.string().default(""),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const transcript = data.messages
      .slice(-24)
      .map((m) => `${m.role === "user" ? "User" : "WorkWise AI"}: ${m.content}`)
      .join("\n\n");

    return run(() =>
      callWorkWiseAi({
        system: chatSystemPrompt(data.length, data.userRole || undefined),
        prompt: `CONVERSATION SO FAR (maintain this context)\n${transcript}\n\nReply to the latest user message as WorkWise AI.`,
        effort: "low",
      }),
    );
  });

/* ------------------------------ Email writer ------------------------------ */

const EmailInput = z.object({
  recipient: z.enum(["Client", "Manager", "Team", "Colleague"]),
  tone: z.enum(["Formal", "Informal", "Persuasive"]),
  purpose: z.string().min(1, "Please provide some information before continuing."),
  details: z.string().default(""),
  length: lengthSchema,
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) =>
    run(() =>
      callWorkWiseAi({
        system: EMAIL_SYSTEM_PROMPT,
        prompt: emailPrompt(data),
        effort: "low",
      }),
    ),
  );

/* -------------------- Meeting notes / action items / agenda ---------------- */

const TextInput = z.object({
  content: z.string().min(1, "Please provide some information before continuing."),
});

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TextInput.parse(data))
  .handler(async ({ data }) =>
    run(() =>
      callWorkWiseAi({
        system: MEETING_SYSTEM_PROMPT,
        prompt: `MEETING NOTES\n"""\n${data.content.trim()}\n"""\n\nSummarise them now in the required format.`,
        effort: "low",
      }),
    ),
  );

export const createActionItems = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TextInput.parse(data))
  .handler(async ({ data }) =>
    run(() =>
      callWorkWiseAi({
        system: ACTION_ITEMS_SYSTEM_PROMPT,
        prompt: `NOTES OR CONVERSATION\n"""\n${data.content.trim()}\n"""\n\nProduce the structured tasks now.`,
        effort: "low",
      }),
    ),
  );

export const createAgenda = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TextInput.parse(data))
  .handler(async ({ data }) =>
    run(() =>
      callWorkWiseAi({
        system: AGENDA_SYSTEM_PROMPT,
        prompt: `MEETING DETAILS (topic, purpose, participants)\n"""\n${data.content.trim()}\n"""\n\nCreate the agenda now.`,
        effort: "low",
      }),
    ),
  );
