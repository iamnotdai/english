import { useCallback, useEffect, useState } from "react";
import { MONTHS, TABS, TOTAL, kindLabel, monthOf, planFor, sub, title, weekOf } from "../lib/course.js";
import { useProgress, nextDayOf } from "../lib/store.jsx";
import { navigate, pending } from "../lib/router.js";
import { stopAll } from "../lib/speech.js";
import PlanPane from "./panes/PlanPane.jsx";
import OldPane from "./panes/OldPane.jsx";
import VocabPane from "./panes/VocabPane.jsx";
import TalkPane from "./panes/TalkPane.jsx";
import GrammarPane from "./panes/GrammarPane.jsx";
import BuildPane from "./panes/BuildPane.jsx";
import DictPane from "./panes/DictPane.jsx";
import QuizPane from "./panes/QuizPane.jsx";
import SpeakPane from "./panes/SpeakPane.jsx";

const PANES = { plan: PlanPane, old: OldPane, vocab: VocabPane, talk: TalkPane, grammar: GrammarPane, build: BuildPane, dict: DictPane, quiz: QuizPane, speak: SpeakPane };

// Per-day working state (games, card positions, dialogue mode). Reset whenever the day changes,
// because DayPage is keyed by day in App.
const initSession = () => ({
  quiz: null, match: null, build: null, dict: null,
  cards: { v: { i: 0, f: false }, o: { i: 0, f: false } },
  talk: { mode: "read", step: 0, rev: [], idx: 0 },
  showVi: false,
});

export default function DayPage({ day: d, tab }) {
  const { st, setDone } = useProgress();
  const [sess, setSess] = useState(initSession);
  const patch = useCallback((k, v) => setSess(s => {
    const next = typeof v === "function" ? v(s[k]) : v;
    return next === s[k] ? s : { ...s, [k]: next };
  }), []);

  useEffect(() => stopAll, [tab]);

  const P = planFor(d), a = st.act[d] || {}, tasks = P.flatMap(s => s.items);
  const dn = tasks.filter(i => a[i[0]]).length, wk = weekOf(d), mi = monthOf(d);
  const tabDone = k => { const its = tasks.filter(i => i[3] === k); return its.length > 0 && its.every(i => a[i[0]]); };
  const Pane = PANES[tab];

  const markDone = () => {
    setDone(d, true);
    const nx = nextDayOf({ ...st.done, [d]: true });
    if (nx !== d) navigate("#/day/" + nx);
  };

  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <a href="#/">Timeline</a><span>/</span>
        <a href="#/" onClick={() => { pending.month = mi; }}>Month {mi}</a><span>/</span>
        <span>{wk ? wk.name : "Finish line"}</span><span>/</span>
        <span aria-current="page">Day {d}</span>
      </nav>
      <header className="dhead">
        <div className="dnum" aria-hidden="true">{d}</div>
        <div className="dtit">
          <p className="eyebrow">{kindLabel(d)}, {MONTHS[mi - 1].name} ({MONTHS[mi - 1].level})</p>
          <h1>Day {d}: {title(d)}</h1>
          <p>{sub(d)}</p>
        </div>
        <div className="dnav">
          {d > 1 && <a className="btn" href={"#/day/" + (d - 1)}>← Day {d - 1}</a>}
          {d < TOTAL && <a className="btn" href={"#/day/" + (d + 1)}>Day {d + 1} →</a>}
        </div>
      </header>
      <div className="dprog">
        <span>{st.done[d] ? "Day completed" : "Today's plan: " + dn + " of " + tasks.length + " tasks done"}</span>
        <div className="bar"><i style={{ width: (st.done[d] ? 100 : dn / tasks.length * 100) + "%" }}></i></div>
      </div>
      <div className="lay">
        <aside className="side">
          <nav aria-label="Lesson sections">
            {TABS.map(([k, n]) => (
              <a key={k} className={"sl" + (tab === k ? " on" : "")} href={`#/day/${d}/${k}`} aria-current={tab === k ? "page" : undefined}>
                <span>{n}</span>{tabDone(k) && <i className="sok" aria-label="done">✓</i>}
              </a>
            ))}
          </nav>
        </aside>
        <section className="panel" id="panel">
          <h2 className="ph">{TABS.find(t => t[0] === tab)[1]}</h2>
          <Pane day={d} sess={sess} patch={patch} />
        </section>
      </div>
      <div className="dfoot">
        {st.done[d]
          ? <><span className="muted">You've completed this day.</span><button className="btn" onClick={() => setDone(d, false)}>Mark as not complete</button></>
          : <><span className="muted">Finished everything? You can also mark the day complete manually.</span><button className="btn solid" onClick={markDone}>Mark Day {d} complete</button></>}
      </div>
    </>
  );
}
