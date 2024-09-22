import type { Habit } from "@/types";

export { habits };

const habits: Habit[] = [
  {
    id: crypto.randomUUID(),
    title: "Jeg skal game hver dag!",
    createdAt: new Date("2024-01-01"),
    categories: ["spill"],
    userId: "1",
    endedAt: null,
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal kode hver dag!",
    createdAt: new Date("2024-01-04"),
    categories: ["koding", "programmering"],
    userId: "1",
    endedAt: null,
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal trene hver dag!",
    createdAt: new Date("2024-01-07"),
    categories: ["trening", "helse"],
    userId: "2",
    endedAt: null,
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal lese hver dag",
    createdAt: new Date("2024-01-02"),
    categories: ["programmering"],
    userId: "1",
    endedAt: null,
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal lese hver dag",
    createdAt: new Date("2024-03-02"),
    categories: ["programmering"],
    userId: "1",
    endedAt: new Date("2024-05-05"),
  },
];
