import { READER_LIST } from "../lib/readers";
import { useSession } from "../lib/session";

export function PickReader() {
  const { chooseReader } = useSession();
  return (
    <div className="app">
      <h1>Quem está lendo?</h1>
      <p className="muted">Toque no seu nome para continuar.</p>
      <div className="row" style={{ marginTop: 24 }}>
        {READER_LIST.map((r) => (
          <button
            key={r.id}
            className="btn primary"
            style={{ flex: 1, background: r.accent }}
            onClick={() => chooseReader(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
}
