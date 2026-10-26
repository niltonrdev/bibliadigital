export type ReaderId = "nilton" | "tamires";

export const READERS: Record<
  ReaderId,
  { id: ReaderId; name: string; accent: string }
> = {
  nilton: { id: "nilton", name: "Nilton", accent: "#7eb6ff" },
  tamires: { id: "tamires", name: "Tamires", accent: "#f3a6c8" },
};

export const READER_LIST = Object.values(READERS);
