import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "Completed";

export type Task = {
  id: string;
  time: string;
  title: string;
  priority: Priority;
  duration: string;
  status: TaskStatus;
  notes?: string;
  deadline?: string;
};

export type Settings = {
  name: string;
  role: string;
  workStart: string;
  workEnd: string;
  breakMinutes: number;
  defaultPriority: Priority;
  responseLength: "concise" | "balanced" | "detailed";
  theme: "light" | "dark" | "system";
};

const TASKS_KEY = "workwise.tasks.v1";
const SETTINGS_KEY = "workwise.settings.v1";
const CHAT_KEY = "workwise.chat.v1";

export const DEFAULT_SETTINGS: Settings = {
  name: "Alex",
  role: "Project Coordinator",
  workStart: "09:00",
  workEnd: "17:00",
  breakMinutes: 30,
  defaultPriority: "Medium",
  responseLength: "balanced",
  theme: "dark",
};

const SAMPLE_TASKS: Task[] = [
  { id: "t1", time: "09:00", title: "Finalise monthly report", priority: "High", duration: "90m", status: "Completed" },
  { id: "t2", time: "10:30", title: "Prepare team meeting notes", priority: "Medium", duration: "45m", status: "Completed" },
  { id: "t3", time: "11:15", title: "Respond to client emails", priority: "High", duration: "30m", status: "Pending" },
  { id: "t4", time: "13:00", title: "Analyse sales data", priority: "Medium", duration: "60m", status: "Pending" },
  { id: "t5", time: "14:30", title: "Complete presentation deck", priority: "High", duration: "75m", status: "Pending" },
  { id: "t6", time: "16:00", title: "Review hiring pipeline", priority: "Low", duration: "40m", status: "Pending" },
];

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type Store = {
  hydrated: boolean;
  tasks: Task[];
  settings: Settings;
  chat: ChatMessage[];
  aiActions: number;
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Omit<Task, "id">[]) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  saveSettings: (settings: Settings) => void;
  setChat: (messages: ChatMessage[]) => void;
  clearChat: () => void;
  countAiAction: () => void;
};

const StoreContext = createContext<Store | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function WorkWiseProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [tasks, setTasksState] = useState<Task[]>(SAMPLE_TASKS);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [chat, setChatState] = useState<ChatMessage[]>([]);
  const [aiActions, setAiActions] = useState(0);

  useEffect(() => {
    setTasksState(read(TASKS_KEY, SAMPLE_TASKS));
    setSettingsState({ ...DEFAULT_SETTINGS, ...read(SETTINGS_KEY, {} as Partial<Settings>) });
    setChatState(read(CHAT_KEY, [] as ChatMessage[]));
    const session = Number(sessionStorage.getItem("workwise.aiActions") ?? "0");
    setAiActions(Number.isFinite(session) ? session : 0);
    setHydrated(true);
  }, []);

  // Theme handling (dark by default)
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const prefersDark =
      settings.theme === "dark" ||
      (settings.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", prefersDark);
  }, [hydrated, settings.theme]);

  const setTasks = useCallback((next: Task[]) => {
    setTasksState(next);
    localStorage.setItem(TASKS_KEY, JSON.stringify(next));
  }, []);

  const addTasks = useCallback(
    (incoming: Omit<Task, "id">[]) => {
      setTasksState((current) => {
        const next = [...current, ...incoming.map((t) => ({ ...t, id: newId() }))].sort((a, b) =>
          a.time.localeCompare(b.time),
        );
        localStorage.setItem(TASKS_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasksState((current) => {
      const next = current.map((t) => (t.id === id ? { ...t, ...patch } : t));
      localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasksState((current) => {
      const next = current.filter((t) => t.id !== id);
      localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveSettings = useCallback((next: Settings) => {
    setSettingsState(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }, []);

  const setChat = useCallback((next: ChatMessage[]) => {
    setChatState(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
  }, []);

  const clearChat = useCallback(() => {
    setChatState([]);
    localStorage.removeItem(CHAT_KEY);
  }, []);

  const countAiAction = useCallback(() => {
    setAiActions((n) => {
      const next = n + 1;
      sessionStorage.setItem("workwise.aiActions", String(next));
      return next;
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      hydrated,
      tasks,
      settings,
      chat,
      aiActions,
      setTasks,
      addTasks,
      updateTask,
      deleteTask,
      saveSettings,
      setChat,
      clearChat,
      countAiAction,
    }),
    [
      hydrated,
      tasks,
      settings,
      chat,
      aiActions,
      setTasks,
      addTasks,
      updateTask,
      deleteTask,
      saveSettings,
      setChat,
      clearChat,
      countAiAction,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useWorkWise() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useWorkWise must be used inside WorkWiseProvider");
  return store;
}

/** Parses the markdown schedule table returned by the AI into task rows. */
export function parseScheduleTable(markdown: string): Omit<Task, "id">[] {
  const lines = markdown.split("\n");
  const rows: Omit<Task, "id">[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) continue;
    const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
    if (cells.length < 4) continue;
    if (/^-+$/.test(cells[0].replace(/[: ]/g, ""))) continue;
    if (/^time$/i.test(cells[0])) continue;
    if (!/\d{1,2}[:.]\d{2}/.test(cells[0])) continue;

    const priorityCell = cells[2] ?? "";
    const priority: Priority = /high/i.test(priorityCell)
      ? "High"
      : /low/i.test(priorityCell)
        ? "Low"
        : "Medium";

    rows.push({
      time: cells[0].replace(/\s*[–-]\s*\d{1,2}[:.]\d{2}\s*$/, "").replace(".", ":"),
      title: cells[1].replace(/\*\*/g, ""),
      priority,
      duration: (cells[3] || "—").replace(/\*\*/g, ""),
      status: /complete/i.test(cells[4] ?? "") ? "Completed" : "Pending",
    });
  }

  return rows;
}
