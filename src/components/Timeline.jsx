import { MONTHS, WEEKS, TOTAL, L, kind, kindLabel, monthOf, planFor, studiedMin, fmtMin, title } from "../lib/course.js";
import { useProgress } from "../lib/store.jsx";
import { scrollToMonth } from "../lib/router.js";

const ROUTINE = [
  ["Morning", "30 min", "Review earlier words using spaced repetition, then shadow the previous dialogue."],
  ["Noon", "30 min", "Learn the day's new words with picture cards, then study the grammar point."],
  ["Afternoon", "1 hour", "Role-play the dialogue, play the matching game, build sentences, take dictation and do the quiz."],
  ["Evening", "30 min", "Write to the day's prompt, read it aloud and recap the words you haven't mastered."],
];

function dayStatus(d, st, nextDay) {
  const a = st.act[d] || {};
  const tot = planFor(d).reduce((t, s) => t + s.items.length, 0);
  const dn = Object.keys(a).length;
  if (st.done[d]) return ["done", "Completed"];
  if (d === nextDay) return ["next", "Up next"];
  if (dn) return ["prog", dn + " of " + tot + " tasks"];
  return ["", kind(d) === "lesson" ? "" : kindLabel(d)];
}

function DayCard({ d }) {
  const { st, nextDay } = useProgress();
  const [cls, lab] = dayStatus(d, st, nextDay);
  return (
    <a className={`dc ${cls} ${L[d] ? "" : "rv"}`} href={"#/day/" + d}>
      <span className="dn">Day {d}</span>
      <span className="dt">{title(d)}</span>
      <span className="ds">{cls === "done" && <span className="tick" aria-hidden="true">✓</span>}{lab}</span>
    </a>
  );
}

export default function Timeline() {
  const { st, nextDay: nx, doneCount: n } = useProgress();
  const m = MONTHS[monthOf(nx) - 1];
  return (
    <>
      <section className="hero">
        <div className="hero-in">
          <p className="eyebrow">3-month plan, A2 to B1+</p>
          <h1>Ninety days to confident English.</h1>
          <p className="lead">A structured daily routine of 2 hours 30 minutes, split into four short sessions. Six new lessons each week, a review day every seventh day, and a test at the end of each month.</p>
          <div className="cta">
            <a className="btn solid lg" href={"#/day/" + nx}>{n ? "Continue" : "Start"} with Day {nx}: {title(nx)}</a>
            <button className="btn lg ghost" onClick={() => scrollToMonth(monthOf(nx), true)}>View this month</button>
          </div>
        </div>
      </section>
      <section className="stats" aria-label="Your progress">
        <div className="stat"><span>Days completed</span><b>{n}<small> / {TOTAL}</small></b><div className="bar"><i style={{ width: n / TOTAL * 100 + "%" }}></i></div></div>
        <div className="stat"><span>Time studied</span><b>{fmtMin(studiedMin(st.act))}</b><p>Counted from finished tasks</p></div>
        <div className="stat"><span>Current stage</span><b>{m.level}</b><p>{m.name}</p></div>
        <div className="stat"><span>Words to review</span><b>{st.hard.length}</b><p>Flagged as not learned yet</p></div>
      </section>
      <section className="block">
        <div className="bh"><h2>Your daily routine</h2><p>The same four sessions every day, so studying becomes a habit.</p></div>
        <div className="rgrid">
          {ROUTINE.map((r, i) => (
            <div className="rc" key={r[0]}><span className="rn">{i + 1}</span><h3>{r[0]}<em>{r[1]}</em></h3><p>{r[2]}</p></div>
          ))}
        </div>
      </section>
      <section className="block">
        <div className="bh row">
          <div><h2>Timeline</h2><p>Pick any day to open its lesson page.</p></div>
          <div className="jump">
            {MONTHS.map((x, i) => <button key={i} className="btn small" onClick={() => scrollToMonth(i + 1, true)}>Month {i + 1}</button>)}
          </div>
        </div>
        {MONTHS.map((mo, mi) => {
          const s = mi * 30 + 1;
          const dm = Array.from({ length: 30 }, (_, k) => s + k).filter(d => st.done[d]).length;
          const rows = WEEKS.filter(w => w.month === mi).map(w => ({ name: w.name, theme: w.theme, days: w.days }));
          rows.push({ name: "Finish line", theme: "Review & test", days: [s + 28, s + 29] });
          return (
            <div className="month" id={"month-" + (mi + 1)} key={mi}>
              <div className="mh">
                <div><p className="eyebrow">Month {mi + 1}, days {s}–{s + 29}</p><h3>{mo.name} <span className="lvl">{mo.level}</span></h3></div>
                <div className="mprog"><span>{dm} of 30 days done</span><div className="bar"><i style={{ width: dm / 30 * 100 + "%" }}></i></div></div>
              </div>
              <ol className="weeks">
                {rows.map(w => {
                  const all = w.days.every(d => st.done[d]);
                  return (
                    <li className="wk" key={w.name}>
                      <div className="wkl"><span className={"node" + (all ? " done" : "")} aria-hidden="true"></span><b>{w.name}</b><span>{w.theme}</span></div>
                      <div className="days">{w.days.map(d => <DayCard key={d} d={d} />)}</div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </section>
    </>
  );
}
