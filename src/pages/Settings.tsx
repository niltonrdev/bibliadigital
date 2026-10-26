import { useSession } from "../lib/session";
import { READERS } from "../lib/readers";

export function SettingsPage() {
  const { reader, theme, fontSize, setTheme, setFontSize, switchReader } =
    useSession();
  return (
    <>
      <h1>Ajustes</h1>
      <div className="card">
        <p>
          Lendo como <strong>{reader ? READERS[reader].name : ""}</strong>
        </p>
        <button className="btn" onClick={switchReader}>
          Trocar de pessoa
        </button>
      </div>
      <div className="card">
        <h2>Aparência</h2>
        <div className="row">
          {(["dark", "sepia", "light"] as const).map((t) => (
            <button
              key={t}
              className={`btn${theme === t ? " primary" : ""}`}
              onClick={() => setTheme(t)}
            >
              {t === "dark" ? "Escuro" : t === "sepia" ? "Sépia" : "Claro"}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Tamanho da letra</h2>
        <div className="row">
          <button className="btn" onClick={() => setFontSize(fontSize - 2)}>
            A−
          </button>
          <span style={{ alignSelf: "center" }}>{fontSize}px</span>
          <button className="btn" onClick={() => setFontSize(fontSize + 2)}>
            A+
          </button>
        </div>
        <p style={{ fontSize }}>
          No princípio era o Verbo, e o Verbo estava com Deus.
        </p>
      </div>
      <p className="muted">
        Texto: Bíblia Livre (BLIVRE), licença Creative Commons Atribuição 3.0.
      </p>
    </>
  );
}
