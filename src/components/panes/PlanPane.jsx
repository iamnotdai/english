import { planFor, planMins, fmtMin } from "../../lib/course.js";
import { useProgress } from "../../lib/store.jsx";

export default function PlanPane({ day, patch }) {
  const { st, toggleTask, setVmode } = useProgress();
  const P = planFor(day), a = st.act[day] || {};
  const all = P.every(s => s.items.every(i => a[i[0]]));

  const open = vm => {
    if (!vm) return;
    setVmode(vm);
    patch("cards", cs => ({ ...cs, v: { ...cs.v, f: false } }));
    patch("match", null);
  };

  return (
    <>
      <p className="muted intro">Four sessions, {fmtMin(P.reduce((t, s) => t + planMins(s), 0))} in total. Open each task, then tick it off. The day is marked complete once every task is ticked.</p>
      {all && <p className="okmsg">Day {day} complete. Great work!</p>}
      {P.map(s => {
        const sd = s.items.filter(i => a[i[0]]).length;
        return (
          <section className="sess" key={s.n}>
            <div className="sh">
              <h3>{s.n}<span>{fmtMin(planMins(s))}</span></h3>
              <p>{s.h}{sd ? `, ${sd} of ${s.items.length} done` : ""}</p>
            </div>
            <ul>
              {s.items.map(i => (
                <li key={i[0]} className={a[i[0]] ? "ck" : ""}>
                  <button className="cb" role="checkbox" aria-checked={!!a[i[0]]} aria-label={"Mark as done: " + i[2]} onClick={() => toggleTask(day, i[0])}>{a[i[0]] ? "✓" : ""}</button>
                  <span className="it">{i[2]}</span>
                  <span className="mn">{i[1]} min</span>
                  <a className="btn small" href={`#/day/${day}/${i[3]}`} onClick={() => open(i[4])}>Open</a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
