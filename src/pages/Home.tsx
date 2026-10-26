import { Link } from "react-router-dom";
import { BOOKS } from "../lib/bible";
import { READERS, type ReaderId } from "../lib/readers";
import type { ChapterRead, Presence } from "../lib/types";
import { getBook } from "../lib/bible";

export function Home({
  reads,
  presence,
  me,
}: {
  reads: ChapterRead[];
  presence: Presence[];
  me: ReaderId;
}) {
  const otherId: ReaderId = me === "nilton" ? "tamires" : "nilton";
  const other = presence.find((p) => p.reader === otherId);
  const otherBook = other ? getBook(other.book_id) : null;

  return (
    <>
      <h1>Novo Testamento</h1>
      {other && otherBook && (
        <p className="presence">
          {READERS[otherId].name} está em {otherBook.name} {other.chapter}.{" "}
          <Link to={`/livro/${other.book_id}/${other.chapter}`}>Ir até lá</Link>
        </p>
      )}
      <div className="book-grid">
        {BOOKS.map((book) => {
          const total = book.chapters.length;
          const mine = reads.filter(
            (r) => r.book_id === book.id && r.reader === me,
          ).length;
          const theirs = reads.filter(
            (r) => r.book_id === book.id && r.reader === otherId,
          ).length;
          return (
            <Link key={book.id} className="book-card" to={`/livro/${book.id}`}>
              <strong>{book.name}</strong>
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                {mine}/{total} capítulos
              </div>
              <div className="progress">
                <span style={{ width: `${(mine / total) * 100}%` }} />
              </div>
              <div className="dots">
                {mine > 0 && <span className={`dot ${me}`} title="Você" />}
                {theirs > 0 && (
                  <span className={`dot ${otherId}`} title={READERS[otherId].name} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
