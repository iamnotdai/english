import { useEffect, useState } from "react";
import { TABS, TOTAL } from "./course.js";

export function parseHash(h) {
  const m = h.match(/^#\/day\/(\d+)(?:\/(\w+))?/);
  if (!m) return { view: "timeline" };
  const day = Math.min(TOTAL, Math.max(1, +m[1]));
  const tab = TABS.some(x => x[0] === m[2]) ? m[2] : "plan";
  return { view: "day", day, tab };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const f = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return route;
}

export const navigate = hash => { window.location.hash = hash; };

// Month to scroll to after the next navigation back to the timeline.
export const pending = { month: 0 };

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToMonth(m, smooth) {
  const el = document.getElementById("month-" + m);
  if (el) el.scrollIntoView({ block: "start", behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
}

// Link target for a month section: scroll if the timeline is showing, otherwise go there first.
export function goToMonth(e, m) {
  e.preventDefault();
  if (parseHash(window.location.hash).view === "timeline") scrollToMonth(m, true);
  else { pending.month = m; navigate("#/"); }
}
