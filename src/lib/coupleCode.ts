const COUPLE_CODE_HASH =
  "cceba0e36b2704677e406b1d8524c785517210f106e09a512fe5c93810b4ec25";

const STORAGE_UNLOCK = "biblia.unlock";
const STORAGE_CODE = "biblia.coupleCode";
const STORAGE_READER = "biblia.reader";

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function unlockWithCode(code: string): Promise<boolean> {
  const hash = await sha256Hex(code);
  if (hash !== COUPLE_CODE_HASH) return false;
  localStorage.setItem(STORAGE_UNLOCK, "1");
  localStorage.setItem(STORAGE_CODE, code.trim());
  return true;
}

export function isUnlocked(): boolean {
  return localStorage.getItem(STORAGE_UNLOCK) === "1" && !!getStoredCode();
}

export function getStoredCode(): string | null {
  return localStorage.getItem(STORAGE_CODE);
}

export function getStoredReader(): "nilton" | "tamires" | null {
  const value = localStorage.getItem(STORAGE_READER);
  if (value === "nilton" || value === "tamires") return value;
  return null;
}

export function setStoredReader(id: "nilton" | "tamires") {
  localStorage.setItem(STORAGE_READER, id);
}

export function clearReader() {
  localStorage.removeItem(STORAGE_READER);
}
