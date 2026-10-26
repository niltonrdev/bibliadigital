import nt from "../data/nt.json";

export type Book = {
  id: number;
  name: string;
  abbrev: string;
  chapters: string[][];
};

export const BOOKS = nt as Book[];

export const TOTAL_CHAPTERS = BOOKS.reduce(
  (sum, book) => sum + book.chapters.length,
  0,
);

export function getBook(id: number): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function chapterKey(bookId: number, chapter: number) {
  return `${bookId}:${chapter}`;
}

export function flattenChapters() {
  const list: { bookId: number; chapter: number; bookName: string }[] = [];
  for (const book of BOOKS) {
    for (let i = 1; i <= book.chapters.length; i++) {
      list.push({ bookId: book.id, chapter: i, bookName: book.name });
    }
  }
  return list;
}

export const CHAPTER_LIST = flattenChapters();

export function nextChapter(bookId: number, chapter: number) {
  const index = CHAPTER_LIST.findIndex(
    (c) => c.bookId === bookId && c.chapter === chapter,
  );
  return CHAPTER_LIST[index + 1] ?? null;
}

export function prevChapter(bookId: number, chapter: number) {
  const index = CHAPTER_LIST.findIndex(
    (c) => c.bookId === bookId && c.chapter === chapter,
  );
  return CHAPTER_LIST[index - 1] ?? null;
}

export function daysBetween(from: Date, to: Date) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.floor((b - a) / 86400000);
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function streakFromDays(days: string[]): number {
  const set = new Set(days);
  let count = 0;
  const cursor = new Date();
  while (true) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;
    if (!set.has(key)) break;
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
