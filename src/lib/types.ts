import type { ReaderId } from "./readers";

export type ChapterRead = {
  reader: ReaderId;
  book_id: number;
  chapter: number;
  read_at: string;
};

export type Highlight = {
  id: string;
  reader: ReaderId;
  book_id: number;
  chapter: number;
  verse: number;
  color: string;
  note: string | null;
};

export type Comment = {
  id: string;
  reader: ReaderId;
  book_id: number;
  chapter: number;
  verse: number | null;
  body: string;
  created_at: string;
};

export type Presence = {
  reader: ReaderId;
  book_id: number;
  chapter: number;
  updated_at: string;
};
