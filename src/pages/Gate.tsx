import { FormEvent, useState } from "react";
import { unlockWithCode } from "../lib/coupleCode";
import { resetSupabase } from "../lib/supabase";
import { useSession } from "../lib/session";

export function Gate() {
  const { setUnlocked } = useSession();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await unlockWithCode(code);
    if (!ok) {
      setError("Código incorreto.");
      return;
    }
    resetSupabase();
    setUnlocked(true);
  }

  return (
    <div className="app">
      <h1>Bíblia Digital</h1>
      <p className="muted">Novo Testamento · leitura a dois</p>
      <form className="card" onSubmit={onSubmit} style={{ marginTop: 24 }}>
        <p>Digite o código do casal. Só precisa disso uma vez neste celular.</p>
        <input
          className="pin"
          inputMode="numeric"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={8}
        />
        {error && <p style={{ color: "#e07a7a" }}>{error}</p>}
        <button className="btn primary wide" type="submit" style={{ marginTop: 12 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
