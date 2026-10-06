import { useEffect } from "react";
import { newBuild } from "../../lib/course.js";
import { say } from "../../lib/speech.js";
import { SayBtn } from "../Shared.jsx";

export default function BuildPane({ day, sess, patch }) {
  useEffect(() => { patch("build", b => (b && b.d === day ? b : newBuild(day, null))); }); // eslint-disable-line react-hooks/exhaustive-deps
  const B = sess.build;
  if (!B) return null;
  const used = new Set(B.ans);
  const set = p => patch("build", b => ({ ...b, ...p }));

  const check = () => {
    const ok = B.ans.map(i => B.t[i]).join(" ").toLowerCase() === B.t.join(" ").toLowerCase();
    set({ res: ok ? "ok" : "bad", n: B.n + 1, score: B.score + (ok ? 1 : 0) });
    say(B.s.en);
  };

  return (
    <>
      <p className="muted intro">Tap the words in the right order to build the sentence. Tap a chosen word to remove it.</p>
      <p className="prompt sm">{B.s.vi ? <>Meaning: <span lang="vi">{B.s.vi}</span></> : B.s.hint}</p>
      <div className="ansbox">
        {B.ans.length
          ? B.ans.map((i, k) => <button key={k} className="chip big" disabled={!!B.res} onClick={() => set({ ans: B.ans.filter((_, x) => x !== k) })}>{B.t[i]}</button>)
          : <span className="muted">Your sentence will appear here</span>}
      </div>
      <div className="chips">
        {B.order.map(i => <button key={i} className="chip big" disabled={used.has(i) || !!B.res} onClick={() => set({ ans: [...B.ans, i] })}>{B.t[i]}</button>)}
      </div>
      {B.res && <p className={B.res === "ok" ? "okmsg" : "badmsg"}>{B.res === "ok" ? "Correct!" : "Not quite. The correct sentence is:"} <span className="ex">{B.s.en}</span></p>}
      <div className="crow left">
        {B.res
          ? <><button className="btn small solid" onClick={() => patch("build", newBuild(day, B))}>Next sentence</button><SayBtn t={B.s.en} label="Hear it" /></>
          : <><button className="btn small solid" disabled={B.ans.length !== B.t.length} onClick={check}>Check</button><button className="btn small" onClick={() => set({ ans: [] })}>Clear</button></>}
      </div>
      <p className="muted small">{B.score} of {B.n} correct this round.</p>
    </>
  );
}
