import { Link } from "react-router-dom";
import { CHAPTER_LIST, TOTAL_CHAPTERS, daysBetween, streakFromDays } from "../lib/bible";
import { READERS, type ReaderId } from "../lib/readers";
import type { ChapterRead } from "../lib/types";

export function PlanPage({
  me,
  reads,
  days,
  planStart,
}: {
  me: ReaderId;
  reads: ChapterRead[];
  days: { reader: ReaderId; day: string }[];
  planStart: string;
}) {
  const start = new Date(`${planStart}T00:00:00`);
  const todayIndex = Math.max(0, daysBetween(start, new Date()));
  const today = CHAPTER_LIST[Math.min(todayIndex, TOTAL_CHAPTERS - 1)];
  const mine = reads.filter((r) => r.reader === me).length;
  const other: ReaderId = me === "nilton" ? "tamires" : "nilton";
  const theirs = reads.filter((r) => r.reader === other).length;
  const streak = streakFromDays(
    days.filter((d) => d.reader === me).map((d) => d.day.slice(0, 10)),
  );

  return (
    <>
      <h1>Plano de leitura</h1>
      <div className="card">
        <p>Um capítulo por dia · {TOTAL_CHAPTERS} capítulos</p>
        <p>
          Sequência: <strong>{streak} dia{streak === 1 ? "" : "s"}</strong>
        </p>
        <p className="muted">
          {READERS[me].name}: {mine}/{TOTAL_CHAPTERS} · {READERS[other].name}: {theirs}/{TOTAL_CHAPTERS}
        </p>
      </div>
      {today && (
        <Link className="card" to={`/livro/${today.bookId}/${today.chapter}`} style={{ display: "block" }}>
          <h2>Leitura de hoje</h2>
          <p>
            {today.bookName} {today.chapter}
          </p>
          <span className="btn primary">Abrir</span>
        </Link>
      )}
    </>
  );
}
