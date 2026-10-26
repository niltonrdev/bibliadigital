import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "./supabase";
import type { ReaderId } from "./readers";
import type { ChapterRead, Comment, Highlight, Presence } from "./types";
import { todayISO } from "./bible";

export function useCoupleData(reader: ReaderId | null) {
  const [reads, setReads] = useState<ChapterRead[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [days, setDays] = useState<{ reader: ReaderId; day: string }[]>([]);
  const [planStart, setPlanStart] = useState<string>(todayISO());
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const sb = getSupabase();
      const [r, h, c, p, d, s] = await Promise.all([
        sb.from("chapter_reads").select("*"),
        sb.from("highlights").select("*"),
        sb.from("comments").select("*").order("created_at"),
        sb.from("presence").select("*"),
        sb.from("reading_days").select("*"),
        sb.from("settings").select("*").eq("key", "plan_start").maybeSingle(),
      ]);
      if (r.error) throw r.error;
      if (h.error) throw h.error;
      if (c.error) throw c.error;
      if (p.error) throw p.error;
      if (d.error) throw d.error;
      setReads((r.data ?? []) as ChapterRead[]);
      setHighlights((h.data ?? []) as Highlight[]);
      setComments((c.data ?? []) as Comment[]);
      setPresence((p.data ?? []) as Presence[]);
      setDays((d.data ?? []) as { reader: ReaderId; day: string }[]);
      if (s.error) throw s.error;
      if (s.data?.value) setPlanStart(s.data.value);
      setError(null);
    } catch (e) {
      const err = e as { message?: string; details?: string; hint?: string };
      setError(
        [err.message, err.details, err.hint].filter(Boolean).join(" — ") ||
          "Erro ao carregar dados",
      );
    }
  }, []);

  useEffect(() => {
    void load();
    const sb = getSupabase();
    const channel = sb
      .channel("couple")
      .on("postgres_changes", { event: "*", schema: "public", table: "chapter_reads" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "highlights" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "presence" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "reading_days" }, () => void load())
      .subscribe();
    return () => {
      void sb.removeChannel(channel);
    };
  }, [load]);

  const markRead = async (bookId: number, chapter: number) => {
    if (!reader) return;
    const sb = getSupabase();
    await sb.from("chapter_reads").upsert(
      { reader, book_id: bookId, chapter },
      { onConflict: "reader,book_id,chapter" },
    );
    await sb.from("reading_days").upsert(
      { reader, day: todayISO() },
      { onConflict: "reader,day" },
    );
    await load();
  };

  const unmarkRead = async (bookId: number, chapter: number) => {
    if (!reader) return;
    await getSupabase()
      .from("chapter_reads")
      .delete()
      .eq("reader", reader)
      .eq("book_id", bookId)
      .eq("chapter", chapter);
    await load();
  };

  const saveHighlight = async (payload: {
    bookId: number;
    chapter: number;
    verse: number;
    color: string;
    note: string;
  }) => {
    if (!reader) return;
    await getSupabase().from("highlights").upsert(
      {
        reader,
        book_id: payload.bookId,
        chapter: payload.chapter,
        verse: payload.verse,
        color: payload.color,
        note: payload.note || null,
      },
      { onConflict: "reader,book_id,chapter,verse" },
    );
    await load();
  };

  const addComment = async (payload: {
    bookId: number;
    chapter: number;
    verse: number | null;
    body: string;
  }) => {
    if (!reader) return;
    await getSupabase().from("comments").insert({
      reader,
      book_id: payload.bookId,
      chapter: payload.chapter,
      verse: payload.verse,
      body: payload.body,
    });
    await load();
  };

  const pingPresence = async (bookId: number, chapter: number) => {
    if (!reader) return;
    await getSupabase().from("presence").upsert(
      {
        reader,
        book_id: bookId,
        chapter,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "reader" },
    );
  };

  return {
    reads,
    highlights,
    comments,
    presence,
    days,
    planStart,
    error,
    reload: load,
    markRead,
    unmarkRead,
    saveHighlight,
    addComment,
    pingPresence,
  };
}
