import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook, nextChapter, prevChapter } from "../lib/bible";
import { READERS, type ReaderId } from "../lib/readers";
import type { Comment, Highlight } from "../lib/types";

const COLORS = [
  { id: "gold", label: "Dourado" },
  { id: "green", label: "Verde" },
  { id: "blue", label: "Azul" },
  { id: "pink", label: "Rosa" },
];

type Props = {
  me: ReaderId;
  fontSize: number;
  readsMine: boolean;
  highlights: Highlight[];
  comments: Comment[];
  markRead: () => Promise<void>;
  unmarkRead: () => Promise<void>;
  saveHighlight: (verse: number, color: string, note: string) => Promise<void>;
  addComment: (verse: number | null, body: string) => Promise<void>;
  pingPresence: () => Promise<void>;
};

export function ChapterPage(props: Props) {
  const { bookId, chapter } = useParams();
  const book = getBook(Number(bookId));
  const ch = Number(chapter);
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [color, setColor] = useState("gold");
  const [comment, setComment] = useState("");
  const [showChapterChat, setShowChapterChat] = useState(false);

  useEffect(() => {
    void props.pingPresence();
    const t = window.setInterval(() => void props.pingPresence(), 20000);
    return () => window.clearInterval(t);
  }, [bookId, chapter, props.pingPresence]);

  const verses = book?.chapters[ch - 1] ?? [];
  const prev = prevChapter(Number(bookId), ch);
  const next = nextChapter(Number(bookId), ch);

  const byVerse = useMemo(() => {
    const map = new Map<number, Highlight[]>();
    for (const h of props.highlights) {
      const list = map.get(h.verse) ?? [];
      list.push(h);
      map.set(h.verse, list);
    }
    return map;
  }, [props.highlights]);

  if (!book) return <p>Capítulo não encontrado.</p>;

  const selectedHighlights = selected ? byVerse.get(selected) ?? [] : [];
  const verseComments = props.comments.filter((c) => c.verse === selected);
  const chapterComments = props.comments.filter((c) => c.verse == null);

  return (
    <>
      <div className="topbar">
        <Link to={`/livro/${book.id}`} className="btn">
          ← Voltar
        </Link>
        <div className="row">
          {prev && (
            <Link className="btn" to={`/livro/${prev.bookId}/${prev.chapter}`}>
              ←
            </Link>
          )}
          {next && (
            <Link className="btn" to={`/livro/${next.bookId}/${next.chapter}`}>
              →
            </Link>
          )}
        </div>
      </div>
      <h1>
        {book.name} {ch}
      </h1>
      <div>
        {verses.map((text, i) => {
          const n = i + 1;
          const marks = byVerse.get(n) ?? [];
          const bg = marks[0]
            ? `var(--mark-${marks[0].color})`
            : "transparent";
          return (
            <div
              key={n}
              className={`verse${selected === n ? " active" : ""}`}
              style={{ background: bg, fontSize: props.fontSize }}
              onClick={() => {
                setSelected(n);
                setNote(marks.find((m) => m.reader === props.me)?.note ?? "");
                setColor(marks.find((m) => m.reader === props.me)?.color ?? "gold");
              }}
            >
              <span className="n">{n}</span>
              <span>{text}</span>
            </div>
          );
        })}
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        {props.readsMine ? (
          <button className="btn" onClick={() => void props.unmarkRead()}>
            Desmarcar capítulo
          </button>
        ) : (
          <button className="btn primary" onClick={() => void props.markRead()}>
            Marcar como lido
          </button>
        )}
        <button className="btn" onClick={() => setShowChapterChat(true)}>
          Comentários do capítulo
        </button>
      </div>

      {selected != null && (
        <div className="sheet">
          <strong>
            Versículo {selected}
          </strong>
          <div className="row" style={{ margin: "10px 0" }}>
            {COLORS.map((c) => (
              <button
                key={c.id}
                className="btn"
                style={{
                  background: `var(--mark-${c.id})`,
                  outline: color === c.id ? "2px solid var(--accent)" : undefined,
                }}
                onClick={() => setColor(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            className="field"
            rows={2}
            placeholder="Nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="row" style={{ marginTop: 8 }}>
            <button
              className="btn primary"
              onClick={() =>
                void props.saveHighlight(selected, color, note).then(() => setSelected(null))
              }
            >
              Salvar marca
            </button>
            <button className="btn" onClick={() => setSelected(null)}>
              Fechar
            </button>
          </div>
          {selectedHighlights.map((h) => (
            <p key={h.id} className="muted">
              {READERS[h.reader].name}
              {h.note ? `: ${h.note}` : " marcou este versículo"}
            </p>
          ))}
          <div style={{ marginTop: 12 }}>
            {verseComments.map((c) => (
              <p key={c.id}>
                <strong>{READERS[c.reader].name}:</strong> {c.body}
              </p>
            ))}
            <input
              className="field"
              placeholder="Comentar este versículo"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn"
              style={{ marginTop: 8 }}
              onClick={() => {
                if (!comment.trim()) return;
                void props.addComment(selected, comment.trim());
                setComment("");
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {showChapterChat && (
        <div className="sheet">
          <strong>Comentários de {book.name} {ch}</strong>
          {chapterComments.map((c) => (
            <p key={c.id}>
              <strong>{READERS[c.reader].name}:</strong> {c.body}
            </p>
          ))}
          <input
            className="field"
            placeholder="Escrever para vocês dois"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="row" style={{ marginTop: 8 }}>
            <button
              className="btn primary"
              onClick={() => {
                if (!comment.trim()) return;
                void props.addComment(null, comment.trim());
                setComment("");
              }}
            >
              Enviar
            </button>
            <button className="btn" onClick={() => setShowChapterChat(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
