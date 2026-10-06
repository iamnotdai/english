import { useEffect } from "react";
import { buildQuiz } from "../../lib/course.js";
import { useProgress } from "../../lib/store.jsx";

export default function QuizPane({ day, sess, patch }) {
  const { st, setBest } = useProgress();
  useEffect(() => { patch("quiz", q => (q && q.d === day ? q : buildQuiz(day, st.hard))); }); // eslint-disable-line react-hooks/exhaustive-deps
  const Q = sess.quiz;
  if (!Q) return null;

  const total = Q.items.length;
  const done = Q.ans.every(a => a !== null);
  const right = Q.ans.filter((a, i) => a === Q.items[i].a).length;
  const best = st.best[day];

  const answer = (i, j) => {
    if (Q.ans[i] !== null) return;
    const ans = Q.ans.map((x, k) => (k === i ? j : x));
    patch("quiz", { ...Q, ans });
    if (ans.every(x => x !== null)) setBest(day, ans.filter((x, k) => x === Q.items[k].a).length);
  };

  return (
    <>
      {Q.items.map((q, i) => (
        <div className="q" key={i}>
          <p><span className="n">{i + 1}.</span>{q.p}{q.pic && <span className="qpic" aria-hidden="true">{q.pic}</span>}</p>
          <div className="opts">
            {q.o.map((o, j) => {
              const a = Q.ans[i];
              let c = "opt";
              if (a !== null) { if (j === q.a) c += " right"; else if (j === a) c += " wrong"; }
              return <button key={j} className={c} disabled={a !== null} lang={q.vi ? "vi" : undefined} onClick={() => answer(i, j)}>{o}</button>;
            })}
          </div>
        </div>
      ))}
      <div className="score">
        {done ? <strong>You scored {right} out of {total}</strong> : <span className="muted">{Q.ans.filter(a => a !== null).length} of {total} answered</span>}
        {best != null && <span className="muted">Best score: {best}/{total}</span>}
        <button className="btn small" onClick={() => patch("quiz", buildQuiz(day, st.hard))}>Try a new set</button>
      </div>
    </>
  );
}
