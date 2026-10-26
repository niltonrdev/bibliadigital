import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ReaderId } from "./readers";
import {
  clearReader,
  getStoredReader,
  isUnlocked,
  setStoredReader,
} from "./coupleCode";

type Theme = "dark" | "sepia" | "light";

type Session = {
  unlocked: boolean;
  reader: ReaderId | null;
  theme: Theme;
  fontSize: number;
  setUnlocked: (value: boolean) => void;
  chooseReader: (id: ReaderId) => void;
  switchReader: () => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
};

const SessionContext = createContext<Session | null>(null);

const THEME_KEY = "biblia.theme";
const FONT_KEY = "biblia.font";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [reader, setReader] = useState<ReaderId | null>(getStoredReader);
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(THEME_KEY) as Theme) || "dark",
  );
  const [fontSize, setFontSizeState] = useState(() => {
    const stored = Number(localStorage.getItem(FONT_KEY));
    return stored || 20;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<Session>(
    () => ({
      unlocked,
      reader,
      theme,
      fontSize,
      setUnlocked,
      chooseReader: (id) => {
        setStoredReader(id);
        setReader(id);
      },
      switchReader: () => {
        clearReader();
        setReader(null);
      },
      setTheme: (next) => {
        localStorage.setItem(THEME_KEY, next);
        setThemeState(next);
      },
      setFontSize: (size) => {
        const next = Math.min(32, Math.max(16, size));
        localStorage.setItem(FONT_KEY, String(next));
        setFontSizeState(next);
      },
    }),
    [unlocked, reader, theme, fontSize],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("SessionProvider ausente");
  return ctx;
}
