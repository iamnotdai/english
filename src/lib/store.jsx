import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TOTAL, allTasksDone } from "./course.js";

const KEY = "e30-v1";
const fresh = () => ({ done: {}, hard: [], notes: {}, best: {}, act: {}, vmode: "word" });

function load() {
  let st = fresh();
  try {
    const r = localStorage.getItem(KEY);
    if (r) { const o = JSON.parse(r); if (o && typeof o === "object") st = Object.assign(st, o); if (!st.act) st.act = {}; }
  } catch { /* storage unavailable */ }
  return st;
}

export function nextDayOf(done) { for (let i = 1; i <= TOTAL; i++) if (!done[i]) return i; return TOTAL; }

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [st, setSt] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage unavailable */ } }, [st]);

  const actions = useMemo(() => ({
    toggleTask(d, id) {
      setSt(s => {
        const o = { ...(s.act[d] || {}) };
        if (o[id]) delete o[id]; else o[id] = true;
        const done = allTasksDone(d, o) ? { ...s.done, [d]: true } : s.done;
        return { ...s, act: { ...s.act, [d]: o }, done };
      });
    },
    setVmode: m => setSt(s => ({ ...s, vmode: m })),
    toggleHard: w => setSt(s => ({ ...s, hard: s.hard.includes(w) ? s.hard.filter(x => x !== w) : [...s.hard, w] })),
    setNote: (d, text) => setSt(s => ({ ...s, notes: { ...s.notes, [d]: text } })),
    setBest: (d, r) => setSt(s => ({ ...s, best: { ...s.best, [d]: Math.max(s.best[d] || 0, r) } })),
    setDone(d, v) {
      setSt(s => {
        const done = { ...s.done };
        if (v) done[d] = true; else delete done[d];
        return { ...s, done };
      });
    },
  }), []);

  const value = useMemo(() => ({
    st,
    ...actions,
    nextDay: nextDayOf(st.done),
    doneCount: Object.keys(st.done).filter(k => st.done[k]).length,
  }), [st, actions]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
