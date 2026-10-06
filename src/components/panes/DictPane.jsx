import { useEffect, useRef } from "react";
import { newDict, norm } from "../../lib/course.js";
import { canSay, say } from "../../lib/speech.js";
import { SayBtn } from "../Shared.jsx";

export default function DictPane({ day, sess, patch }) {
  const input = useRef(null);
  useEffect(() => { if (canSay) patch("dict", x => (x && x.d === day ? x : newDict(day))); }); // eslint-disable-line react-hooks/exhaustive-deps

  if (!canSay) return <p>This browser can't read English aloud, so dictation isn't available. Try Chrome, Edge or Safari.</p>;
  const DI = sess.dict;
  if (!DI) return null;
  const s = DI.list[DI.i], end = DI.i >= DI.list.length - 1;
  const set = p => patch("dict", x => ({ ...x, ...p }));

  const check = () => set({ res: true, score: DI.score + (norm(DI.val) === norm(s.en) ? 1 : 0) });
  const next = () => {
    set({ i: DI.i + 1, res: null, val: "" });
    setTimeout(() => { input.current?.focus(); }, 0);
    setTimeout(() => say(DI.list[DI.i + 1].en), 200);
  };

  let res = null;
  if (DI.res) {
    const a = norm(DI.val).split(" ").filter(Boolean), b = norm(s.en).split(" ");
    res = (
      <div className="dres">
        <p className="lbl" style={{ marginTop: 0 }}>You wrote</p>
        <p>{a.length ? a.map((w, i) => <span key={i}><span className={w === b[i] ? "wok" : "wbad"}>{w}</span>{i < a.length - 1 ? " " : ""}</span>) : <span className="muted">(nothing)</span>}</p>
        <p className="lbl">Correct sentence</p>
        <p className="ex" style={{ margin: 0 }}>{s.en}</p>
        {s.vi && <p className="muted" lang="vi" style={{ margin: "4px 0 0" }}>{s.vi}</p>}
      </div>
    );
  }

  return (
    <>
      <p className="muted intro">Listen to the sentence as many times as you like, type exactly what you hear, then press Check. Punctuation and capital letters don't matter.</p>
      <div className="crow left">
        <SayBtn t={s.en} label="Play" />
        <button className="btn small" onClick={() => say(s.en, null, .62)}>Play slowly</button>
        <span className="count">Sentence {DI.i + 1} of {DI.list.length}</span>
      </div>
      <input
        ref={input} id="dict" className="dinput" type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} lang="en"
        aria-label="Type what you hear" placeholder="Type what you hear..." value={DI.val} disabled={!!DI.res}
        onChange={e => set({ val: e.target.value })}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (!DI.res) check(); } }}
      />
      {res}
      <div className="crow left" style={{ marginTop: 12 }}>
        {DI.res
          ? (end
            ? <button className="btn small solid" onClick={() => patch("dict", newDict(day))}>New round</button>
            : <button className="btn small solid" onClick={next}>Next sentence</button>)
          : <button className="btn small solid" onClick={check}>Check</button>}
      </div>
      <p className="muted small">{DI.score} perfect {DI.score === 1 ? "sentence" : "sentences"} this round.</p>
    </>
  );
}
