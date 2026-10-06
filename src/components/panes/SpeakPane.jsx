import { useEffect, useMemo, useRef, useState } from "react";
import { L, SPEAK_EN, deck, shuffle } from "../../lib/course.js";
import { useProgress } from "../../lib/store.jsx";
import { canSay, say } from "../../lib/speech.js";

export default function SpeakPane({ day }) {
  const { st, setNote } = useProgress();
  const ta = useRef(null);
  const timer = useRef(0);
  const caret = useRef(null);
  const [saved, setSaved] = useState(false);
  const prompt = L[day] ? L[day].s : SPEAK_EN[day];
  // Suggested words are picked once per visit, not on every keystroke.
  const words = useMemo(() => shuffle(deck(day, st.hard)).slice(0, L[day] ? 5 : 8), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const value = st.notes[day] || "";

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (caret.current != null && ta.current) { ta.current.selectionStart = ta.current.selectionEnd = caret.current; caret.current = null; }
  });

  const update = text => {
    setNote(day, text);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(true), 400);
  };

  const insert = w => {
    const el = ta.current;
    const s = el.selectionStart ?? value.length;
    const ins = (s > 0 && !/\s$/.test(value.slice(0, s)) ? " " : "") + w + " ";
    caret.current = s + ins.length;
    el.focus();
    update(value.slice(0, s) + ins + value.slice(s));
  };

  return (
    <>
      <p className="prompt">{prompt}</p>
      <p className="lbl">Try to use these words (tap to insert)</p>
      <div className="chips">
        {words.map(w => <button key={w[0]} className="chip" onClick={() => insert(w[0])}>{w[0]}</button>)}
      </div>
      <label className="lbl" htmlFor="note">Your writing (saved automatically in this browser)</label>
      <textarea ref={ta} id="note" spellCheck lang="en" placeholder="Write here..." value={value} onChange={e => update(e.target.value)} />
      <div className="saved">{saved ? "Saved" : ""}</div>
      <div className="crow left">
        {canSay && <button className="btn small" onClick={() => say(value)}>Read my text aloud</button>}
      </div>
      <p className="muted small">Tip: read your text aloud 2–3 times, then try to say it again without looking.</p>
    </>
  );
}
