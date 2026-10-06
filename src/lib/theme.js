import { useEffect, useState } from "react";

const KEY = "e30-theme";
const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function initial() {
  try { const t = localStorage.getItem(KEY); if (t === "light" || t === "dark") return t; } catch { /* storage unavailable */ }
  return systemDark() ? "dark" : "light";
}

// Light/dark theme, applied as data-theme on <html> (the CSS already defines both palettes).
export function useTheme() {
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === "dark" ? "light" : "dark"))];
}
