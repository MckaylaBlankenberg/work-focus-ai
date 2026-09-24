/**
 * Server-only helper for Lovable AI Gateway (Responses API).
 * The API key is read inside the call and never leaves the server.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

type CallOptions = {
  system: string;
  prompt: string;
  effort?: "low" | "medium" | "high";
};

/**
 * Calls the gateway with streaming enabled (required for reasoning models),
 * accumulates the streamed text server-side and returns the final answer.
 */
export async function callWorkWiseAi({ system, prompt, effort = "low" }: CallOptions): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new AiError("AI service is not configured.", 500);
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      instructions: system,
      input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
      reasoning: { effort, summary: "auto" },
      include: ["reasoning.encrypted_content"],
      store: false,
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    console.error("AI gateway error", res.status, detail.slice(0, 500));
    if (res.status === 429) {
      throw new AiError("The AI assistant is busy right now. Please try again in a moment.", 429);
    }
    if (res.status === 402 || res.status === 403) {
      throw new AiError("AI usage is currently unavailable for this workspace.", res.status);
    }
    throw new AiError("We couldn't generate a response right now. Please try again.", 502);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let reasoning = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            text += event.delta;
          } else if (
            event.type === "response.reasoning_summary_text.delta" &&
            typeof event.delta === "string"
          ) {
            reasoning += event.delta;
          } else if (event.type === "response.completed" && !text) {
            text = event.response?.output_text ?? "";
          }
        } catch {
          // ignore partial / non-JSON frames
        }
      }
    }
  }

  const answer = text.trim() || reasoning.trim();
  if (!answer) {
    throw new AiError("The AI returned an empty response. Please try again.", 502);
  }
  return answer;
}
