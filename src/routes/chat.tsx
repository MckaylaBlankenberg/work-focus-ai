import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  BriefcaseBusiness,
  ClipboardList,
  Copy,
  FileText,
  Mail,
  MessageSquareText,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AiErrorState, AiOutput } from "@/components/workwise/AiOutput";
import { PageHeader, ResponsibleNotice } from "@/components/workwise/Primitives";
import {
  createActionItems,
  createAgenda,
  generateEmail,
  sendChatMessage,
  summariseMeeting,
} from "@/lib/ai.functions";
import { cn } from "@/lib/utils";
import { newId, useWorkWise } from "@/lib/workwise-store";

const MODES = ["chat", "email", "meeting", "actions", "agenda"] as const;
type Mode = (typeof MODES)[number];

export const Route = createFileRoute("/chat")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: MODES.includes(search.mode as Mode) ? (search.mode as Mode) : "chat",
  }),
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — WorkWise AI" },
      { name: "description", content: "Draft emails, summarise meetings, create action items and get contextual workplace support." },
      { property: "og:title", content: "AI Workplace Chat — WorkWise AI" },
      { property: "og:description", content: "One professional AI workspace for everyday communication and meeting tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkplaceChat,
});

const TOOLS = [
  { id: "chat", label: "Ask AI", icon: MessageSquareText },
  { id: "email", label: "Write Email", icon: Mail },
  { id: "meeting", label: "Summarise Meeting", icon: FileText },
  { id: "actions", label: "Action Items", icon: ClipboardList },
  { id: "agenda", label: "Meeting Agenda", icon: BriefcaseBusiness },
] as const;

function WorkplaceChat() {
  const { mode } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { settings, chat, setChat, clearChat, countAiAction } = useWorkWise();
  const ask = useServerFn(sendChatMessage);
  const writeEmail = useServerFn(generateEmail);
  const summarise = useServerFn(summariseMeeting);
  const extractActions = useServerFn(createActionItems);
  const buildAgenda = useServerFn(createAgenda);
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [details, setDetails] = useState("");
  const [recipient, setRecipient] = useState<"Client" | "Manager" | "Team" | "Colleague">("Client");
  const [tone, setTone] = useState<"Formal" | "Informal" | "Persuasive">("Formal");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (mode === "chat") inputRef.current?.focus();
    setError(null);
    setResult(null);
  }, [mode]);

  const selectMode = (next: Mode) => navigate({ search: { mode: next }, replace: true });
  const fail = (value: unknown) =>
    setError(value instanceof Error ? value.message : "We couldn't generate a response right now. Please try again.");

  const submitChat = async ({ text }: { text: string }) => {
    const message = text.trim();
    if (!message || loading) return;
    const userMessage = { id: newId(), role: "user" as const, content: message, createdAt: Date.now() };
    const next = [...chat, userMessage];
    setChat(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const { text: reply } = await ask({
        data: {
          messages: next.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
          length: settings.responseLength,
          userRole: settings.role,
        },
      });
      setChat([...next, { id: newId(), role: "assistant", content: reply, createdAt: Date.now() }]);
      countAiAction();
    } catch (requestError) {
      fail(requestError);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const runTool = async () => {
    if (!content.trim()) {
      setError("Please provide some information before continuing.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response =
        mode === "email"
          ? await writeEmail({ data: { recipient, tone, purpose: content, details, length: settings.responseLength } })
          : mode === "meeting"
            ? await summarise({ data: { content } })
            : mode === "actions"
              ? await extractActions({ data: { content } })
              : await buildAgenda({ data: { content } });
      setResult(response.text);
      countAiAction();
    } catch (requestError) {
      fail(requestError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Workplace Chat" subtitle="One contextual workspace for communication, meetings and everyday support." />

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Workplace AI tools">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button key={tool.id} variant={mode === tool.id ? "default" : "outline"} size="sm" className="shrink-0 gap-2" onClick={() => selectMode(tool.id)}>
              <Icon className="size-3.5" /> {tool.label}
            </Button>
          );
        })}
      </div>

      {mode === "chat" ? (
        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><BriefcaseBusiness className="size-4" /></div>
              <div><h2 className="text-sm font-semibold">WorkWise Assistant</h2><p className="text-[11px] text-muted-foreground">Professional workplace guidance</p></div>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5" disabled={!chat.length || loading} onClick={() => { clearChat(); setError(null); }}>
              <RotateCcw className="size-3.5" /> Clear
            </Button>
          </div>
          <Conversation className="h-[460px]">
            <ConversationContent className="mx-auto w-full max-w-3xl gap-5 px-4 py-6">
              {chat.length === 0 ? (
                <ConversationEmptyState icon={<BriefcaseBusiness className="size-8 text-primary" />} title="How can I help with your work?" description="Ask for help drafting, planning, clarifying or preparing workplace content.">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><BriefcaseBusiness className="size-6" /></div>
                    <div><h3 className="font-display font-semibold">How can I help with your work?</h3><p className="mt-1 text-sm text-muted-foreground">Ask for help drafting, planning, clarifying or preparing workplace content.</p></div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Help me prepare for a difficult conversation", "Turn my notes into a clear update", "Suggest questions for my project review"].map((prompt) => (
                        <Button key={prompt} variant="outline" size="sm" onClick={() => setInput(prompt)}>{prompt}</Button>
                      ))}
                    </div>
                  </div>
                </ConversationEmptyState>
              ) : chat.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : undefined}>
                    <MessageResponse>{message.content}</MessageResponse>
                  </MessageContent>
                  <span className={cn("text-[10px] text-muted-foreground", message.role === "user" && "text-right")}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </Message>
              ))}
              {loading ? <Shimmer className="text-sm">Thinking...</Shimmer> : null}
              {error ? <AiErrorState message={error} /> : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="border-t border-border p-3 sm:p-4">
            <PromptInput onSubmit={submitChat} className="mx-auto max-w-3xl">
              <PromptInputTextarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask WorkWise AI about your work..." />
              <PromptInputFooter className="justify-between">
                <span className="text-[11px] text-muted-foreground">Enter to send · Shift + Enter for a new line</span>
                <PromptInputSubmit status={loading ? "submitted" : error ? "error" : "ready"} disabled={!input.trim() || loading} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      ) : (
        <ToolWorkspace mode={mode} content={content} setContent={setContent} details={details} setDetails={setDetails} recipient={recipient} setRecipient={setRecipient} tone={tone} setTone={setTone} loading={loading} error={error} result={result} onRun={runTool} />
      )}
      <ResponsibleNotice />
    </div>
  );
}

type ToolProps = {
  mode: Exclude<Mode, "chat">; content: string; setContent: (value: string) => void; details: string; setDetails: (value: string) => void;
  recipient: "Client" | "Manager" | "Team" | "Colleague"; setRecipient: (value: "Client" | "Manager" | "Team" | "Colleague") => void;
  tone: "Formal" | "Informal" | "Persuasive"; setTone: (value: "Formal" | "Informal" | "Persuasive") => void;
  loading: boolean; error: string | null; result: string | null; onRun: () => void;
};

function ToolWorkspace(props: ToolProps) {
  const labels = {
    email: { title: "Professional Email Generator", input: "What is the email about?", placeholder: "Request an updated delivery date for the project...", action: "Generate Email" },
    meeting: { title: "Meeting Notes Summariser", input: "Paste your meeting notes", placeholder: "Paste raw meeting notes, decisions and discussion points...", action: "Summarise Meeting" },
    actions: { title: "Action-Item Creator", input: "Paste notes or a conversation", placeholder: "Paste notes that contain tasks, owners or deadlines...", action: "Create Action Items" },
    agenda: { title: "Meeting Agenda Generator", input: "Describe the meeting", placeholder: "Include the topic, purpose, participants and available time...", action: "Generate Agenda" },
  }[props.mode];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-display text-base font-semibold">{labels.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">AI creates a review-ready draft from only the information you provide.</p>
        {props.mode === "email" ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><Label>Recipient</Label><Select value={props.recipient} onValueChange={props.setRecipient}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["Client", "Manager", "Team", "Colleague"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Tone</Label><Select value={props.tone} onValueChange={props.setTone}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["Formal", "Informal", "Persuasive"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          </div>
        ) : null}
        <div className="mt-4"><Label>{labels.input}</Label><Textarea className="mt-1.5 min-h-48" value={props.content} onChange={(event) => props.setContent(event.target.value)} placeholder={labels.placeholder} /></div>
        {props.mode === "email" ? <div className="mt-3"><Label>Supporting details</Label><Textarea className="mt-1.5 min-h-24" value={props.details} onChange={(event) => props.setDetails(event.target.value)} placeholder="Add dates, context, requests or points that must be included." /></div> : null}
        <Button className="mt-4 w-full sm:w-auto" disabled={props.loading} onClick={props.onRun}>{props.loading ? "Working..." : labels.action}</Button>
      </section>
      <div>
        {props.loading ? <div className="rounded-xl border border-border bg-card p-6"><Shimmer>Preparing your draft...</Shimmer></div> : null}
        {props.error ? <AiErrorState message={props.error} /> : null}
        {props.result ? <AiOutput title={labels.title.replace("Generator", "Draft")} text={props.result} /> : null}
        {!props.loading && !props.error && !props.result ? <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-border bg-card p-8 text-center"><div><div className="mx-auto grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><Copy className="size-5" /></div><h3 className="mt-3 font-display font-semibold">Your draft will appear here</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Provide the source information, then generate a structured draft ready for your review.</p></div></div> : null}
      </div>
    </div>
  );
}