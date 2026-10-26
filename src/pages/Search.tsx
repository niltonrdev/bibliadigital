import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BOOKS } from "../lib/bible";

export function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const hits: { bookId: number; book: string; chapter: number; verse: number; text: string }[] = [];
    for (const book of BOOKS) {
      book.chapters.forEach((verses, ci) => {
        verses.forEach((text, vi) => {
          if (text.toLowerCase().includes(term)) {
            hits.push({
              bookId: book.id,
              book: book.name,
              chapter: ci + 1,
              verse: vi + 1,
              text,
            });
          }
        });
      });
      if (hits.length > 80) break;
    }
    return hits.slice(0, 80);
  }, [q]);

  return (
    <>
      <h1>Busca</h1>
      <input
        className="field"
        placeholder="Palavra ou trecho"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <p className="muted">{q.trim().length < 2 ? "Digite ao menos 2 letras." : `${results.length} resultados`}</p>
      {results.map((r) => (
        <Link
          key={`${r.bookId}-${r.chapter}-${r.verse}`}
          className="search-hit"
          to={`/livro/${r.bookId}/${r.chapter}`}
          style={{ display: "block" }}
        >
          <strong>
            {r.book} {r.chapter}:{r.verse}
          </strong>
          <div
            dangerouslySetInnerHTML={{
              __html: highlight(r.text, q),
            }}
          />
        </Link>
      ))}
    </>
  );
}

function highlight(text: string, q: string) {
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${safe})`, "ig"), "<mark>$1</mark>");
}
