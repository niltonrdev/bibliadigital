import { Link, useParams } from "react-router-dom";
import { getBook } from "../lib/bible";
import type { ReaderId } from "../lib/readers";
import type { ChapterRead } from "../lib/types";

export function BookPage({
  reads,
  me,
}: {
  reads: ChapterRead[];
  me: ReaderId;
}) {
  const { bookId } = useParams();
  const book = getBook(Number(bookId));
  if (!book) return <p>Livro não encontrado.</p>;
  const other: ReaderId = me === "nilton" ? "tamires" : "nilton";

  return (
    <>
      <div className="topbar">
        <Link to="/" className="btn">
          ← Voltar
        </Link>
      </div>
      <h1>{book.name}</h1>
      <div className="book-grid">
        {book.chapters.map((_, i) => {
          const chapter = i + 1;
          const mine = reads.some(
            (r) =>
              r.book_id === book.id && r.chapter === chapter && r.reader === me,
          );
          const theirs = reads.some(
            (r) =>
              r.book_id === book.id &&
              r.chapter === chapter &&
              r.reader === other,
          );
          return (
            <Link
              key={chapter}
              className="book-card"
              to={`/livro/${book.id}/${chapter}`}
            >
              Capítulo {chapter}
              <div className="dots">
                {mine && <span className={`dot ${me}`} />}
                {theirs && <span className={`dot ${other}`} />}
              </div>
              {mine && theirs && (
                <div className="muted" style={{ marginTop: 6 }}>
                  Lido pelos dois
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
