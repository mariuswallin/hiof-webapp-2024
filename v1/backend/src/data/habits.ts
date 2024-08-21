export { habits };

const habits = [
  {
    id: crypto.randomUUID(),
    title: "Jeg skal game hver dag!",
    createdAt: new Date("2024-01-01"),
    categories: ["spill"],
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal kode hver dag!",
    createdAt: new Date("2024-01-04"),
    categories: ["koding", "programmering"],
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal trene hver dag!",
    createdAt: new Date("2024-01-07"),
    categories: ["trening", "helse"],
  },
  {
    id: crypto.randomUUID(),
    title: "Jeg skal lese hver dag",
    createdAt: new Date("2024-01-02"),
    categories: ["programmering"],
  },
];
