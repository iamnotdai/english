import { pic, wtype, isHard } from "../lib/course.js";
import { canSay, say, playAll, stopAll, useSpeech } from "../lib/speech.js";
import { useProgress } from "../lib/store.jsx";

export function SayBtn({ t, label = "Listen", w = null }) {
  if (!canSay) return null;
  return <button className="btn small" onClick={() => say(t, w)}>{label}</button>;
}

// Flashcard with prev/next, listen and flag controls. `c` selects the card cursor ("v" vocab, "o" old words).
export function CardBlock({ dk, c, mode, sess, patch }) {
  const { st, toggleHard } = useProgress();
  const S = sess.cards[c];
  const i = S.i >= dk.length ? 0 : S.i;
  const w = dk[i];
  const h = isHard(st.hard, w);
  const setCard = p => patch("cards", cs => ({ ...cs, [c]: { ...cs[c], ...p } }));

  const front = mode === "pic"
    ? <><span className="emo" aria-hidden="true">{pic(w)}</span><span className="q2">What's the word?</span><span className="hint">Say it out loud, then tap to check</span></>
    : <><span className="emo" aria-hidden="true">{pic(w)}</span><span className="w">{w[0]}</span><span className="ty">{wtype(w)}</span><span className="hint">Tap to see the meaning</span></>;
  const back = <><span className="emo" aria-hidden="true">{pic(w)}</span><span className="w">{w[0]}</span><span className="ty">{wtype(w)}</span><span className="vi" lang="vi">{w[2]}</span><span className="ex">{w[3]}</span></>;

  return (
    <>
      <button className={"card" + (h ? " hard" : "")} aria-label="Flip card" onClick={() => setCard({ i, f: !S.f })}>{S.f ? back : front}</button>
      <div className="crow">
        <button className="btn small" disabled={i === 0} onClick={() => setCard({ i: i - 1, f: false })}>Previous</button>
        <span className="count">{i + 1} of {dk.length}</span>
        <button className="btn small" disabled={i === dk.length - 1} onClick={() => setCard({ i: i + 1, f: false })}>Next</button>
      </div>
      <div className="crow">
        <SayBtn t={w[0]} label="Hear the word" />
        <SayBtn t={w[3]} label="Hear the example" />
        <button className={"btn small red" + (h ? " on" : "")} aria-pressed={h} onClick={() => toggleHard(w[0])}>{h ? "Flagged to review" : "Flag to review"}</button>
      </div>
    </>
  );
}

export function DialogLines({ D, showVi }) {
  const { line } = useSpeech();
  return (
    <div className="dlg">
      {D.l.map((l, i) => (
        <div key={i} className={`line s${l[0]}${line === i ? " playing" : ""}`}>
          <span className="who">{D.p[l[0]]}</span>
          <div className="bub">
            <p className="ex">{l[1]}</p>
            {showVi && <p className="vi" lang="vi">{l[2]}</p>}
          </div>
          <SayBtn t={l[1]} w={l[0]} />
        </div>
      ))}
    </div>
  );
}

export function PlayCtl({ lines, showVi, toggleVi }) {
  const { playing } = useSpeech();
  return (
    <div className="crow left">
      {canSay && <button className="btn small" onClick={() => playing ? stopAll() : playAll(lines)}>{playing ? "Stop" : "Play whole dialogue"}</button>}
      <button className="btn small" onClick={toggleVi}>{showVi ? "Hide Vietnamese" : "Show Vietnamese"}</button>
    </div>
  );
}
