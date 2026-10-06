import { useEffect } from "react";
import { L, deck, isHard, newMatch, pic, wtype } from "../../lib/course.js";
import { useProgress } from "../../lib/store.jsx";
import { say } from "../../lib/speech.js";
import { CardBlock } from "../Shared.jsx";

const MODES = [["word", "Word first"], ["pic", "Picture first"], ["match", "Matching game"]];

export default function VocabPane({ day, sess, patch }) {
  const { st, setVmode } = useProgress();
  const dk = deck(day, st.hard), vm = st.vmode || "word";
  const hardN = dk.filter(w => isHard(st.hard, w)).length;

  const pickMode = m => {
    setVmode(m);
    patch("cards", cs => ({ ...cs, v: { ...cs.v, f: false } }));
    patch("match", null);
  };

  return (
    <>
      <div className="seg" role="group" aria-label="Study mode">
        {MODES.map(([m, n]) => <button key={m} aria-pressed={vm === m} onClick={() => pickMode(m)}>{n}</button>)}
      </div>
      {vm === "match"
        ? <MatchGame day={day} dk={dk} sess={sess} patch={patch} />
        : <>
            {!L[day] && hardN > 0 && <p className="muted intro">{hardN} flagged {hardN > 1 ? "words come" : "word comes"} first.</p>}
            <CardBlock dk={dk} c="v" mode={vm} sess={sess} patch={patch} />
            <h3 className="subh" style={{ marginTop: 28 }}>Word list</h3>
            <div className="wlist">
              {dk.map(x => (
                <div key={x[0]}>
                  <span className="en"><span className="pe" aria-hidden="true">{pic(x)}</span>{x[0]}{isHard(st.hard, x) && <> <span className="flag" title="Flagged">✱</span></>}</span>
                  <span className="wt">{wtype(x)}</span>
                  <span lang="vi">{x[2]}</span>
                </div>
              ))}
            </div>
          </>}
    </>
  );
}

function MatchGame({ day, dk, sess, patch }) {
  useEffect(() => { patch("match", m => (m && m.d === day ? m : newMatch(day, dk))); }); // eslint-disable-line react-hooks/exhaustive-deps
  const M = sess.match;
  if (!M) return null;
  const all = M.ok.length === M.ws.length;

  const pickPic = i => patch("match", m => ({ ...m, sp: i, bad: null }));
  const pickWord = i => {
    if (M.sp === null) return;
    if (i === M.sp) {
      say(M.ws[i][0]);
      patch("match", m => ({ ...m, tries: m.tries + 1, ok: [...m.ok, i], sp: null, bad: null }));
    } else {
      patch("match", m => ({ ...m, tries: m.tries + 1, bad: [m.sp, i] }));
      setTimeout(() => patch("match", m => (m ? { ...m, bad: null } : m)), 700);
    }
  };

  return (
    <>
      <p className="muted intro">Tap a picture, then tap the English word that matches it.</p>
      <div className="mg">
        <div className="tiles">
          {M.pics.map(i => {
            const ok = M.ok.includes(i);
            return <button key={i} className={`tile pic${M.sp === i ? " sel" : ""}${ok ? " ok" : ""}${M.bad && M.bad[0] === i ? " bad" : ""}`} disabled={ok} aria-label={"Picture " + (i + 1)} onClick={() => pickPic(i)}>{pic(M.ws[i])}</button>;
          })}
        </div>
        <div className="tiles">
          {M.words.map(i => {
            const ok = M.ok.includes(i);
            return <button key={i} className={`tile${ok ? " ok" : ""}${M.bad && M.bad[1] === i ? " bad" : ""}`} disabled={ok} onClick={() => pickWord(i)}>{M.ws[i][0]}</button>;
          })}
        </div>
      </div>
      <div className="score">
        {all ? <strong>All matched in {M.tries} tries!</strong> : <span className="muted">{M.ok.length} of {M.ws.length} matched</span>}
        <button className="btn small" onClick={() => patch("match", newMatch(day, dk))}>New round</button>
      </div>
    </>
  );
}
