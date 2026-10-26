import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Nav } from "./components/Nav";
import { useSession } from "./lib/session";
import { useCoupleData } from "./lib/useCoupleData";
import { Gate } from "./pages/Gate";
import { PickReader } from "./pages/PickReader";
import { Home } from "./pages/Home";
import { BookPage } from "./pages/Book";
import { ChapterPage } from "./pages/Chapter";
import { SearchPage } from "./pages/Search";
import { PlanPage } from "./pages/Plan";
import { SettingsPage } from "./pages/Settings";

export default function App() {
  const { unlocked, reader, fontSize } = useSession();
  if (!unlocked) return <Gate />;
  if (!reader) return <PickReader />;
  return <LoggedApp reader={reader} fontSize={fontSize} />;
}

function LoggedApp({
  reader,
  fontSize,
}: {
  reader: "nilton" | "tamires";
  fontSize: number;
}) {
  const data = useCoupleData(reader);
  return (
    <div className="app">
      {data.error && <p className="card">{data.error}</p>}
      <Routes>
        <Route
          path="/"
          element={<Home reads={data.reads} presence={data.presence} me={reader} />}
        />
        <Route path="/livro/:bookId" element={<BookPage reads={data.reads} me={reader} />} />
        <Route
          path="/livro/:bookId/:chapter"
          element={<ChapterRoute data={data} reader={reader} fontSize={fontSize} />}
        />
        <Route path="/busca" element={<SearchPage />} />
        <Route
          path="/plano"
          element={
            <PlanPage
              me={reader}
              reads={data.reads}
              days={data.days}
              planStart={data.planStart}
            />
          }
        />
        <Route path="/ajustes" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Nav />
    </div>
  );
}

function ChapterRoute({
  data,
  reader,
  fontSize,
}: {
  data: ReturnType<typeof useCoupleData>;
  reader: "nilton" | "tamires";
  fontSize: number;
}) {
  const { bookId, chapter } = useParams();
  const bid = Number(bookId);
  const ch = Number(chapter);
  const readsMine = data.reads.some(
    (r) => r.reader === reader && r.book_id === bid && r.chapter === ch,
  );
  const highlights = data.highlights.filter(
    (h) => h.book_id === bid && h.chapter === ch,
  );
  const comments = data.comments.filter(
    (c) => c.book_id === bid && c.chapter === ch,
  );
  return (
    <ChapterPage
      me={reader}
      fontSize={fontSize}
      readsMine={readsMine}
      highlights={highlights}
      comments={comments}
      markRead={() => data.markRead(bid, ch)}
      unmarkRead={() => data.unmarkRead(bid, ch)}
      saveHighlight={(verse, color, note) =>
        data.saveHighlight({ bookId: bid, chapter: ch, verse, color, note })
      }
      addComment={(verse, body) =>
        data.addComment({ bookId: bid, chapter: ch, verse, body })
      }
      pingPresence={() => data.pingPresence(bid, ch)}
    />
  );
}
